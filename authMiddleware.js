/** A middleware to authenticate the admin user and authorize the post,put,delete functionality only to the user admin */

function auth(req, res, next) {
  if (req.query.user == "admin") {
    //use enum
    console.log("Admin authentication sucessfull :)");
    next();
    return;
  }

  res.status(401).send("Authintication failed :(");
  console.log("Authentical failed :(");
}
export default auth;
