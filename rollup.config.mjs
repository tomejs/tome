import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/compiler/index.ts',
    output: [
      {
        file: 'dist/compiler.js',
        format: 'cjs'
      },
      {
        file: 'dist/compiler.mjs',
        format: 'esm'
      }
    ],
    plugins: [
      resolve(),
			commonjs({
				include: ['node_modules/**']
			}),
      sucrase({transforms: ['typescript']})
    ]
  },
  {
    input: 'src/internal/index.ts',
    output: [
      {
        file: 'dist/internal.js',
        format: 'cjs'
      },
      {
        file: 'dist/internal.mjs',
        format: 'esm'
      }
    ],
    plugins: [sucrase({transforms: ['typescript']})]
  },
  {
    input: 'src/runtime/index.ts',
    output: [
      {
        file: 'dist/runtime.js',
        format: 'cjs'
      },
      {
        file: 'dist/runtime.mjs',
        format: 'esm'
      }
    ],
    plugins: [sucrase({transforms: ['typescript']})]
  },
  {
    input: 'src/temp.ts',
    output: [
      {
        file: 'dist/temp.js',
        format: 'cjs'
      },
      {
        file: 'dist/temp.mjs',
        format: 'esm'
      }
    ],
    plugins: [sucrase({transforms: ['typescript']})]
  }
];
