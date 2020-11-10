import http from 'http'
import net from 'net'
import { URL } from 'url'

// Create an HTTP tunneling proxy
const proxy = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('okay')
})

proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  console.log(req.url)
  const { port, hostname } = new URL(`http://${req.url}`)

  const serverSocket = net.connect(Number(port) || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' + 'Proxy-agent: Node.js-Proxy\r\n' + '\r\n')
    serverSocket.write(head)
    serverSocket.pipe(clientSocket)
    clientSocket.pipe(serverSocket)
  })
})

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {
  console.log('Proxy listening.')

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80'
  }

  const req = http.request(options)
  req.end()

  req.on('connect', (_res, socket) => {
    console.log('Got connected.')

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' + 'Host: www.google.com:80\r\n' + 'Connection: close\r\n' + '\r\n')

    socket.on('data', (chunk) => {
      console.log(chunk.toString())
    })
    socket.on('end', () => {
      proxy.close()
    })
  })
})
