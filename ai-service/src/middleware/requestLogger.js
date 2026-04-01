const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  
  const logData = {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify(logData));
  next();
};
