require("./config/config.js");
require("./db/mongoose.js");
const express = require("express");
const bodyParser = require("body-parser");
const port = (process.env.PORT||5000);

var app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(new Date().toDateString() + " : " + req.method + " request for " + req.url);
    next();
});

require("./routes/index.js")(app); // adding all routes defined in the /routes directory

//handling requests to a route that is not defined
app.all('*', function(req, res, next) {
    res.status(404).send("Page Not Found");
  });

app.listen(port, () => {
    console.log(`Server started no port ${port}...`);
})

module.exports = {
    app
};