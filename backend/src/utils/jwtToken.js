//creating token and saving in cookie

const sendJWTToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    expires: new Date(
      //Date.now()->gives date when token is store in cookie
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 //COOKIE_EXPIRE=5, not specifying days so 24*3600*1000 ms
    ),
    httpOnly: true,
  };

  //for response we have cookie while for request we have cookies
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendJWTToken;
