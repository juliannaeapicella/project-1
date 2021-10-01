const http = require('http');
const url = require('url');
const query = require('querystring');
const handler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response) => {
  const res = response;

  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler.addUser(request, res, bodyParams);
  });
};

const urlStruct = {
  GET: {
    '/': handler.getIndex,
    '/style.css': handler.getCSS,
    '/getUsers': handler.getUsers,
    '/notReal': handler.notFound,
    notFound: handler.notFound,
  },
  POST: {
    '/addUser': handlePost,
  },
  HEAD: {
    '/getUsers': handler.getUsersMeta,
    '/notReal': handler.notFoundMeta,
    notFound: handler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
