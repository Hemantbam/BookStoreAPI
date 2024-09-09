const role = {
  //use enum
  Admin: "admin",
  customer: "customer",
};

/** A middleware to authenticate the admin user and authorize the post,put,delete functionality only to the user admin */
function auth(req, res, next) {
  if (req.query.user == role.Admin) {
    next();
    return;
  }
  res.status(401).send("Authintication failed :(");
}
export default auth;
