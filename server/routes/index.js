const fs = require("fs");
var _ = require("lodash");
const { ObjectID } = require("mongodb");
var name = "";

module.exports = function (app) {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;

        name = file;
        try{
            require('./' + name)(app);
        }catch(e){
            console.log("Exception occured while loading route file '" + name + "' " + e.message)
        }
    });
}
