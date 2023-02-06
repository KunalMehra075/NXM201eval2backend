const { UserModel } = require("../Models/users.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const express = require("express");
const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  const { name, email, pass, role } = req.body;
  try {
    bcrypt.hash(pass, 5, async function (err, hash) {
      if (hash) {
        const instance = new UserModel({ name, email, pass: hash, role });
        console.log(instance);
        await instance.save();
        res.json({ Msg: "Signup Success" });
      } else {
        res.send({ Error: err });
      }
    });
  } catch (error) {
    console.log(err);
    res.send({ Error: err });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, userrole: user.role },
            process.env.Normal_Secret,
            { expiresIn: 60 }
          );
          const refresh_token = jwt.sign(
            { userId: user._id, userrole: user.role },
            process.env.Refresh_Secret,
            { expiresIn: 300 }
          );
          res.json({ Msg: "Login Success", token, refresh_token });
        }
      });
    } else {
      res.json("No User Found");
    }
  } catch (error) {
    console.log(err);
    res.send({ Error: err });
  }
});
UserRouter.get("/getnewtoken", async (req, res) => {
  const refresh_token = req.headers.authorization;
  if (!refresh_token) {
    return res.json("Refresh token expired, please login again");
  }
  jwt.verify(refresh_token, process.env.Refresh_Secret, (err, decoded) => {
    if (err) {
      res.json({ msg: "Refresh Token not present", err: err });
    } else {
      const token = jwt.sign(
        { userId: decoded.userId, userrole: decoded.userrole },
        process.env.Normal_Secret,
        { expiresIn: 60 }
      );
      res.json({ Message: "Here's your new token", token });
    }
  });
});

UserRouter.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    let blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
    if (blacklist.includes(token)) {
      res.send({ Msg: "Logged out successfully" });
    } else {
      blacklist.push(token);
      fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist));
      res.send({ Msg: "Logged out successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send({ Error: err });
  }
});
module.exports = { UserRouter };
