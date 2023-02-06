const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { authorise } = require("./middlewares/Authorization.middleware");
const { authenticate } = require("./middlewares/Authentication.middleware");
const { UserRouter } = require("./Routes/users.route");

const app = express();
app.use(express.json());
app.use(cors("*"));
app.use("/users", UserRouter);

app.get("/", (req, res) => {
  try {
    res.send("Welcome to Goldrate");
  } catch (err) {
    console.log(err);
    res.send({ Error: err });
  }
});

app.get(
  "/goldrate",
  authenticate,
  authorise(["manager", "customer"]),
  async (req, res) => {
    res.send({ Msg: "goldrate" });
  }
);
app.get(
  "/userstats",
  authenticate,
  authorise(["manager"]),
  async (req, res) => {
    res.send({ Msg: "UserStats" });
  }
);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB");
  }
  console.log(`Server is Running on port ${process.env.port}`);
});
