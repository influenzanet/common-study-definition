import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import del from 'rollup-plugin-delete';
import multiInput from 'rollup-plugin-multi-input';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const packageJson = require("./package.json");

const config = {
  input: [
    "src/**/*.ts"
  ],
  output: [
    {
      //file: packageJson.main,
      dir: 'build',
      format: "cjs",
      sourcemap: true
    },
  ],
  plugins: [
    del({
      targets: 'build/*'
    }),
    multiInput({ relative: 'src/' }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    copy({
      targets: [
        { src: 'package.json', dest: 'build' }
      ]
    })
  ]
};

export default config;
