const helper = require('./responseHelper.js');

const tasks = {};
const completedTasks = {};

const getTasks = (request, response) => {
  const responseJSON = {
    tasks,
  };

  helper.respondJSON(request, response, 200, responseJSON);
};

const getTasksMeta = (request, response) => {
  helper.respondJSONMeta(request, response, 200);
};

const getCompletedTasks = (request, response) => {
  const responseJSON = {
    completedTasks,
  };

  helper.respondJSON(request, response, 200, responseJSON);
};

const getCompletedTasksMeta = (request, response) => {
  helper.respondJSONMeta(request, response, 200);
};

/// TBD: get with parameters (sort)??

const addTask = (request, response, body) => {
  const responseJSON = {
    message: 'Title is required',
  };

  if (!body.title) {
    responseJSON.id = 'missingParams';
    return helper.respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (tasks[body.title]) {
    responseCode = 204;
  } else {
    tasks[body.title] = {};
  }

  tasks[body.title].title = body.title;
  tasks[body.title].desc = body.desc ? body.desc : '';
  tasks[body.title].date = body.date ? body.date : '';
  tasks[body.title].time = body.time ? body.time : '';
  tasks[body.title].priority = body.priority ? body.priority : '';

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return helper.respondJSON(request, response, responseCode, responseJSON);
  }

  return helper.respondJSONMeta(request, response, responseCode);
};

const addCompletedTask = (request, response, body) => {
  const responseJSON = {
    message: 'Title is required',
  };

  if (!body.title) {
    responseJSON.id = 'missingParams';
    return helper.respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (completedTasks[body.title]) {
    responseCode = 204;
  } else {
    completedTasks[body.title] = {};
  }

  delete tasks[body.title];
  completedTasks[body.title].title = body.title;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return helper.respondJSON(request, response, responseCode, responseJSON);
  }

  return helper.respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  helper.respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  helper.respondJSONMeta(request, response, 404);
};

module.exports = {
  getTasks,
  getTasksMeta,
  getCompletedTasks,
  getCompletedTasksMeta,
  addTask,
  addCompletedTask,
  notFound,
  notFoundMeta,
};
