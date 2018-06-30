// file to store app configurations
var env = process.env.NODE_ENV || "dev";
if (env == "test"){
    process.env.DBURL = "mongodb://localhost:27017/crud-app-test"
    process.env.PORT = 4000;
}else if (env == "production"){
    process.env.DBURL = "mongodb://crud-app-db:crud-app-db1@ds121336.mlab.com:21336/crud-app"
}else{
    process.env.DBURL = "mongodb://localhost:27017/crud-app"
    process.env.PORT = 5000;
}

module.exports = {
    maxTweetsReturn:15
}