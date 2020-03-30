/**
 * Created by gaozy on 3/22/20.
 */
// content of index.js
const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
    console.log(request.url);
    response.end('Hello Node.js Server!\n');
    // response.write('Hello world!');
    // response.flushHeaders();
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})