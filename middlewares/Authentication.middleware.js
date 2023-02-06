const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.json({ msg: "Token not present, Login Again" });
    return;
  }
  //   blacklisting
  let blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
  if (blacklist.includes(token)) {
    return res.json({ message: "token blacklisted,please login again" });
  }
  // verifying
  jwt.verify(token, process.env.Normal_Secret, (err, decoded) => {
    if (err) {
      res.json({ msg: "Token not present", err: err });
    } else {
      req.body.userrole = decoded.userrole;
      console.log("Authentication success");
      next();
    }
  });
};

module.exports = { authenticate };
