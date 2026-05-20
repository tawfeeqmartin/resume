import * as esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const watch = process.argv.includes('--watch');
const outdir = 'dist';
const outfile = `${outdir}/app.js`;

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
  console.log(`built ${outfile} (${result.code.length.toLocaleString()} bytes)`);
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
  for (const file of ['components.js', 'app.jsx']) {
    watchFs(file, { persistent: true }, rebuild);
  }
  console.log('watching components.js and app.jsx');
}
