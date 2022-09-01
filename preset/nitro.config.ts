import { defineNitroPreset } from 'nitropack'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'pathe'
import { promises as fsp } from 'node:fs'

export default defineNitroPreset({
  extends: 'node',
  entry: fileURLToPath(new URL('./entry.ts', import.meta.url)),
  serveStatic: true,
  output: {
    dir: '{{ buildDir }}'
  },
  commands: {
    preview: 'node ./server/node-cluster.index.mjs'
  },
  hooks: {
    async 'compiled' (nitro) {
      const path = resolve(nitro.options?.output?.dir || '.', 'server', 'node-cluster.index.mjs')
      await writeFile(path, entryTemplate())
    }
  }
})

function entryTemplate () {
  return `
import os from 'node:os'
import cluster from 'node:cluster'
import { resolve } from 'pathe'

(() => {
  const numCPUs = os.cpus().length
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
      cluster.fork()
    })
  } else {
    const path = process.cwd().endsWith('.output') ?
      resolve('.', 'server', 'index.mjs') :
      resolve('.', 'server', '.output', 'server', 'index.mjs')
    import(path)
  }
})()
  `.trim()
}

async function writeFile (path: string, contents: string) {
  await fsp.mkdir(dirname(path), { recursive: true })
  await fsp.writeFile(path, contents, 'utf-8')
}
