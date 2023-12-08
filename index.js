let express = require("express");
let app = express();
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
  multipleStatements: true,
});

const COLUMNS = ["id", "username", "password", "name", "email"];

//funktion för att anropa alla befintliga användare.
app.get("/users", function (req, res) {
  let sql = "SELECT * FROM users";
  con.query(sql, function (err, result, fields) {
    res.send(result);
  });
});

//funktionen anropar specifik användare genom användar id.
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

//json format
app.use(express.json());

//post funktion för att registera ny användare.
app.post("/users", function (req, res) {
  const { username, password, name, email } = req.body;
  if (isValidUserData(req.body)) {
    let sql = `INSERT INTO users (username, password, name, email)
      VALUES ('${username}', 
      '${password}',
      '${name}',
      '${email}')`;

    con.query(sql, function (err, result, fields) {
      if (err) {
        console.log(err);
        res.status(500).send("Fel i databasanropet!");
        throw err;
      }
      let output = {
        id: result.insertId,
        username: username,
        password: password,
        name: name,
        email: email,
      };
      res.json(output);
    });
  }
  //om ny data, ska alla kollumner fyllas , annars felmedelande skrivs ut.
  else {
    res.status(422).send("Please fill in all the required fields!");
  }
});

function isValidUserData(body) {
  return body && body.username && body.password && body.name && body.email;
}
