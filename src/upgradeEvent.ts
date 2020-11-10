import http from 'http'

// Create an HTTP server
const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('okay')
})

server.on('upgrade', (_req, socket) => {
  socket.write(
    'HTTP/1.1 101 Web Socket Protocol Handshake\r\n' + 'Upgrade: WebSocket\r\n' + 'Connection: Upgrade\r\n' + '\r\n'
  )
  // Echo back
  socket.pipe(socket)
})

// Now that server is running
server.listen(1337, '127.0.0.1', () => {
  // Make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      Connection: 'Upgrade',
      Upgrade: 'websocket'
    }
  }

  const req = http.request(options)
  req.end()

  req.on('upgrade', (_res, socket) => {
    console.log('Got upgraded.')
    socket.end()
    server.close()
  })
})
