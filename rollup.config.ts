/*
 * @Author: shen
 * @Date: 2020-12-28 10:05:11
 * @LastEditors: shen
 * @LastEditTime: 2020-12-29 08:17:11
 * @Description:
 */

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'es', sourcemap: true },
    { file: 'dist/uni-request.umd.js', name: 'uniRequest', format: 'umd', sourcemap: true },
  ],
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
}
