// Bundles the login helper for the browser: src/auth.js -> public/js/auth.js
import { build } from 'esbuild';
await build({
  entryPoints: ['src/auth.js'],
  outfile: 'public/js/auth.js',
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2019'],
});
console.log('built public/js/auth.js');
