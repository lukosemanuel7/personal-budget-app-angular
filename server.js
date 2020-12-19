const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const cors = require("cors");
const extjwt = require("express-jwt");
const bodyparser = require("body-parser");
const path = require("path");
const mongoClient = require("mongodb").MongoClient;

const PORT = 3000;
const secretkey = "My secret access token";
const refreshTokenKey = "yourrefreshtokensecrethere";
const refreshTokens = [];

const url =
  "mongodb+srv://admin:admin@pbcluster.te0u7.mongodb.net/personalbudget?retryWrites=true&w=majority";

const jwtMW = extjwt({
  secret: secretkey,
  algorithms: ["HS256"],
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  mongoClient.connect(url, (err, client) => {
    if (err) throw err;

    client
      .db("personalbudget")
      .collection("users")
      .insertOne(
        { username: username, password: password },
        function (err, result) {
          if (err) {
            res.status(400).json({
              success: false,
              token: null,
              err: "Invalid username or password",
            });
          }

          const token = jwt.sign({ username }, secretkey, { expiresIn: 60 });
          const refreshToken = jwt.sign({ username }, refreshTokenKey);

          refreshTokens.push(refreshToken);

          res.json({
            success: true,
            err: null,
            id: result._id,
            username,
            token,
            refreshToken,
          });

          console.log(result);
          client.close();
        }
      );
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  mongoClient.connect(url, (err, client) => {
    if (err) throw err;

    client
      .db("personalbudget")
      .collection("users")
      .findOne(
        { username: username, password: password },
        function (err, result) {
          console.log(result);
          if (err) {
            res.status(400).json({
              success: false,
              token: null,
              err: "Invalid username or password",
            });
          }

          const token = jwt.sign({ username }, secretkey, { expiresIn: 60 });
          const refreshToken = jwt.sign({ username }, refreshTokenKey);

          refreshTokens.push(refreshToken);

          res.json({
            success: true,
            err: null,
            id: result._id,
            username,
            token,
            refreshToken,
          });

          client.close();
        }
      );
  });
});

app.post("/api/refreshToken", (req, res) => {
  const { username, token } = req.body;

  console.log(req.body);
  console.log(refreshTokens);
  if (!token) {
    if (err) {
      res.status(400).json({
        success: false,
        token: null,
        err: "Invalid refresh token",
      });
    }
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const token = jwt.sign({ username }, secretkey, { expiresIn: 60 });

    res.json({
      token,
    });
  });
});

app.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((token) => t !== token);

  res.send("Logout successful");
});

app.post("/api/addBudgetId", jwtMW, (req, res) => {
  const { userId, month, year } = req.body;
  console.log("Inside add budget ID");

  console.log({ userId: userId, month: month, year: year });
  mongoClient.connect(url, (err, client) => {
    if (err) throw err;

    client
      .db("personalbudget")
      .collection("budgetMap")
      .insertOne(
        { userId: userId, month: month, year: year },
        function (err, result) {
          if (err) {
            res.status(400).json({
              success: false,
              token: null,
              err: "Invalid input",
            });
          }
          // console.log(result);
          res.json({
            success: true,
            err: null,
            budgetId: result.insertedId,
          });

          client.close();
        }
      );
  });
});

app.post("/api/getBudgetId", jwtMW, (req, res) => {
  const { userId, month, year } = req.body;
  console.log("Inside budget ID");
  console.log({ userId: userId, month: month, year: year });
  mongoClient.connect(url, (err, client) => {
    if (err) throw err;

    client
      .db("personalbudget")
      .collection("budgetMap")
      .findOne(
        { userId: userId, month: month, year: year },
        function (err, result) {
          if (err) {
            res.status(400).json({
              success: false,
              token: null,
              err: "Invalid input",
            });
          console.log(result);
          if (result != null) {
            res.json({
              success: true,
              err: null,
              budgetId: result._id,
            });
          } else {
            res.status(400).json({
              success: false,
              err: "No budget Entry",
              budgetId: null,
            });
          }

          client.close();
        }
      );
  });
});
app.get("/api/budgetID/:budgetId", jwtMW, async function (req, res) {
  var id = req.params.budgetId;
  mongoClient.connect(url, (err, client) => {
    if (err) throw err;
    client
      .db("personalbudget")
      .collection("budgets")
      .find({ budgetId: id })
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          success: true,
          err: null,
          budgets: result,
        });
        client.close();
      });
  });
});

app.delete("/api/budgetID/:budgetId", jwtMW, (req, res) => {
  var id = req.params.budgetId;
  mongoClient.connect(url, (err, client) => {
    if (err) throw err;
    client
      .db("personalbudget")
      .collection("budgets")
      .deleteMany({ budgetId: id }, function (err, obj) {
        if (err) {
          res.status(400).json({
            success: false,
            token: null,
            err: "Invalid input",
          });
        console.log(obj.result.n + " document(s) deleted");
        res.json({
          success: true,
          err: null,
          budgets: obj.result.n,
        });
        client.close();
      });
  });
});

app.post("/api/addBudgets", jwtMW, (req, res) => {
  const { budgetId, expenseName, budgetValue, expenseValue } = req.body;
  console.log("Inside add budgets");

  mongoClient.connect(url, (err, client) => {
    if (err) throw err;

    client
      .db("personalbudget")
      .collection("budgets")
      .insertMany(req.body, function (err, result) {
        if (err) {
          res.status(400).json({
            success: false,
            budgetId: null,
            err: "Invalid details",
          });
        }
        console.log(result);
        res.json({
          success: true,
          err: null,
        });

        client.close();
      });
  });
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Invalid Username/password",
    });
  } else {
    next(err);
  }
});
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
