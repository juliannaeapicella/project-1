const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, isComplete) => {
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

    if (isComplete) {
      jsonHandler.addCompletedTask(request, res, bodyParams);
    } else {
      jsonHandler.addTask(request, res, bodyParams);
    }
  });
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getTasks': jsonHandler.getTasks,
    '/getCompletedTasks': jsonHandler.getCompletedTasks,
    notFound: jsonHandler.notFound,
  },
  POST: {
    '/addTask': handlePost,
    '/addCompletedTask': handlePost,
  },
  HEAD: {
    '/getTasksMeta': jsonHandler.getTasksMeta,
    '/getCompletedTasksMeta': jsonHandler.getCompletedTasksMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    if (request.method === 'POST') {
      urlStruct[request.method][parsedUrl.pathname](request, response, parsedUrl.pathname === '/addCompletedTask');
    } else {
      urlStruct[request.method][parsedUrl.pathname](request, response);
    }
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
