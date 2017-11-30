const express = require("express");

const app = express();

app.use(express.static("example/public"));

app.use(function(req, res) {
  res.sendFile("index.html", {
    root: "example/public"
  });
});

app.listen(process.env.PORT || 4000);
