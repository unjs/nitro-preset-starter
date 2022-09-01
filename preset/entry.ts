import '#internal/nitro/virtual/polyfill'
import { Server } from 'node:http'

const server = new Server()

// @ts-ignore
server.listen(3000, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Listening on http://localhost:3000 (custom preset)`)
})
