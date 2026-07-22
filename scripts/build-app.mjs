import * as esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const watch = process.argv.includes('--watch');
const outdir = 'dist';
const outfile = `${outdir}/app.js`;
const threeOutfile = `${outdir}/three-bundle.js`;
const qrCodeOutfile = `${outdir}/qrcode-bundle.js`;
const gifOutfile = `${outdir}/gif-bundle.js`;

async function build() {
  const [components, app] = await Promise.all([
    readFile('components.js', 'utf8'),
    readFile('app.jsx', 'utf8'),
  ]);
  await mkdir(outdir, { recursive: true });
  const source = [
    "import { createMatchSculptureInstrumentSource } from '../beautifulgame/shared/match-sculpture-instrument.js';",
    'const React = window.React;',
    'const ReactDOM = window.ReactDOM;',
    'const RESUME = window.RESUME;',
    components,
    app,
  ].join('\n\n');
  const result = await esbuild.build({
    stdin: {
      contents: source,
      resolveDir: process.cwd(),
      sourcefile: 'app-entry.jsx',
      loader: 'jsx',
    },
    outfile,
    bundle: true,
    external: ['./gif-bundle.js*', './vendor/strudel-web.mjs'],
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: ['es2020'],
    format: 'esm',
    minify: true,
    sourcemap: false,
    legalComments: 'none',
    write: false,
  });
  const appCode = result.outputFiles[0].text;
  await writeFile(outfile, `${appCode.replace(/\n+$/, '')}\n`);
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
  await esbuild.build({
    entryPoints: ['gif-entry.js'],
    outfile: gifOutfile,
    bundle: true,
    format: 'esm',
    target: ['es2020'],
    minify: true,
    sourcemap: false,
    legalComments: 'none',
  });
  console.log(`built ${outfile} (${appCode.length.toLocaleString()} bytes)`);
  console.log(`built ${threeOutfile}`);
  console.log(`built ${qrCodeOutfile}`);
  console.log(`built ${gifOutfile}`);
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
  for (const file of ['components.js', 'app.jsx', 'three-entry.js', 'qrcode-entry.js', 'gif-entry.js']) {
    watchFs(file, { persistent: true }, rebuild);
  }
  console.log('watching components.js and app.jsx');
}
