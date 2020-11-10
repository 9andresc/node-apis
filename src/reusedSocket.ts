import http from 'http'

http
  .createServer((_req, res) => {
    res.write('hello\n')
    res.end()
  })
  .listen(3000)

const agent = new http.Agent({ keepAlive: true })

function retriableRequest() {
  const req: any = http
    .get('http://localhost:3000', { agent }, (res) => {
      res.on('data', (data) => {
        console.log(data.toString())
      })
    })
    .on('error', (err: any) => {
      // Check if retry is needed
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest()
      }
    })
}

setInterval(() => retriableRequest(), 5000)
