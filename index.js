let app = require("express")();
app.listen(8080);
console.log("Servern körs på port 8080");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
const mysql = require("mysql");
con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dokumentation",
});
const COLUMNS = ["id", "username", "password", "name", "email"];

app.get("/users", function (req, res) {
  let sql = "SELECT * FROM users";
  con.query(sql, function (err, result, fields) {
    res.send(result);
  });
});

app.get("/users/:id", function (req, res) {
  const { id } = req.params;
  let sql = "SELECT * FROM users WHERE id=" + id;
  con.query(sql, function (err, result, fields) {
    if (result.length > 0) {
      res.send(result);
    } else {
      res.sendStatus(204);
    }
  });
});
