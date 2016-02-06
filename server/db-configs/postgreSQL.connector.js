/**
 * Created by wizdev on 1/15/2016.
 */
module.exports = (function(){
    var pg = require('pg');
    var serverConfig = {
        serverName:'localhost:5432',
        database:'postgres',
        userName:"postgres",
        password : "password"
    };

    pg.connectionString = "pg://"+serverConfig['userName']+':'+serverConfig['password']+'@'+serverConfig['serverName']+'/'+serverConfig['database'];
    //var connectionString =  "pg://admin:guest@localhost:5432/Employees";
    /*pg.on("connect", function (err, callback) {
        var client = new pg.Client(connectionString);
        client.connect();
        callback(client);



    });*/
    /*pg.on("open", function(){
        console.log("mongodb is connected on " + serverConfig.dbUrl);
    });

    pg.on("close", function(){
        console.log("mongodb is closed from" + serverConfig.dbUrl);
    });*/
    return pg;
})();