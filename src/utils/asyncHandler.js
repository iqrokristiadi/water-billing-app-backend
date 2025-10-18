// src/utils/catchAsync.js
export default (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
