import * as esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const watch = process.argv.includes('--watch');
const outdir = 'dist';
const outfile = `${outdir}/app.js`;
const threeOutfile = `${outdir}/three-bundle.js`;
const qrCodeOutfile = `${outdir}/qrcode-bundle.js`;

async function build() {
  const [components, app] = await Promise.all([
    readFile('components.js', 'utf8'),
    readFile('app.jsx', 'utf8'),
  ]);
  await mkdir(outdir, { recursive: true });
  const source = [
    'const React = window.React;',
    'const ReactDOM = window.ReactDOM;',
    'const RESUME = window.RESUME;',
    components,
    app,
  ].join('\n\n');
  const result = await esbuild.transform(source, {
    loader: 'jsx',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: ['es2020'],
    format: 'esm',
    minify: true,
    sourcemap: false,
    legalComments: 'none',
  });
  await writeFile(outfile, `${result.code.replace(/\n+$/, '')}\n`);
  await esbuild.build({
    entryPoints: ['three-entry.js'],
    outfile: threeOutfile,
    bundle: true,
    format: 'esm',
    target: ['es2020'],
    minify: true,
    sourcemap: false,
    legalComments: 'none',
  });
  await esbuild.build({
    entryPoints: ['qrcode-entry.js'],
    outfile: qrCodeOutfile,
    bundle: true,
    format: 'iife',
    target: ['es2020'],
    minify: true,
    sourcemap: false,
    legalComments: 'none',
  });
  console.log(`built ${outfile} (${result.code.length.toLocaleString()} bytes)`);
  console.log(`built ${threeOutfile}`);
  console.log(`built ${qrCodeOutfile}`);
}

await build();

if (watch) {
  const { watch: watchFs } = await import('node:fs');
  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      build().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
    }, 80);
  };
  for (const file of ['components.js', 'app.jsx', 'three-entry.js', 'qrcode-entry.js']) {
    watchFs(file, { persistent: true }, rebuild);
  }
  console.log('watching components.js and app.jsx');
}
