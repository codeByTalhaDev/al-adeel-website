const validate = (schema) => (req, res, next) => {
  req.validated = schema.parse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
};

module.exports = validate;