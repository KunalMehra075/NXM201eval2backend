const authorise = (role_array) => {
  let hmm = (req, res, next) => {
    const user = req.body.userrole;

    if (role_array.includes(user)) {
      console.log("Authorization Success");
      next();
    } else {
      res.json({ Msg: "Not Authorised" });
    }
  };
  return hmm;
};
module.exports = { authorise };
