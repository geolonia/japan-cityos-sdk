import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync('package.json'));

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'umd',
      sourcemap: true,
      name: 'City',
      inlineDynamicImports: true,  // コード分割を無効化（UMD形式のため必要）
    },
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      requireReturnsDefault: "auto",
    }),
    typescript(),
    scss({
      output: false,
      insert: true,
    }),
    copy({
      targets: [
        { src: 'public/index.html', dest: 'docs' },
        { src: 'src/style.json', dest: 'docs' }
      ]
    }),
    json(),
  ],
};

export default config;
