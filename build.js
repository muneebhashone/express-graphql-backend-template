const dotenv = require('dotenv')
dotenv.config()
const { build } = require('esbuild')
const define = {}

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const options = {
  entryPoints: ['./src/main.ts'],
  outfile: './dist/main.js',
  bundle: true,
  platform: 'node',
  packages: 'external',
  define,
}

build(options)
  .then((result) => console.log(result))
  .catch(() => process.exit(1))
