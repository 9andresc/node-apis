import http from 'http'

http
  .get('http://nodejs.org/dist/index.json', (res) => {
    const { statusCode } = res
    console.log(res.headers)
    const contentType = res.headers['content-type']

    let error: Error
    if (statusCode >= 400) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`)
    }

    if (error) {
      console.error(error.message)
      // Consume response data to free up memory
      res.resume()
      return
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => {
      rawData += chunk
    })
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData)
        console.log(parsedData)
      } catch (error) {
        console.error(error)
      }
    })
  })
  .on('error', (error) => {
    console.error(`Got error: ${error.message}`)
  })
