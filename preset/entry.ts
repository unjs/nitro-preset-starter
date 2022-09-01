import '#internal/nitro/virtual/polyfill'
import { Server } from 'node:http'

const nitroApp = useNitroApp()
const server = new Server(nitroApp.h3App.nodeHandler)

// @ts-ignore
server.listen(3000, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Listening on http://localhost:3000 (custom preset)`)
})

server.on('request', () => {
  console.log(`PID: ${process.pid}`)
})
