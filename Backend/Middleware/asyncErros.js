const asyncFn = (req, res, next) => {
  Promise.resolve(asyncFn(req, res, next)).catch(next);
};

module.exports = asyncFn;
