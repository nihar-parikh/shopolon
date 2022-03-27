// export default (theFunc) => (req, res, next) => {
//   Promise.resolve(theFunc(req, res, next)).catch(next);
// };

export const catchAsyncErrors = (theFunc) => async (req, res, next) => {
  try {
    await theFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};
