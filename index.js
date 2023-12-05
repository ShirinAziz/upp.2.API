let app = require("express")();
app.listen(8080);
console.log("Servern körs på port 8080");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
