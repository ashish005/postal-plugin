/**
 * Created by Ashish on 1/15/2016.
 */
module.exports = function(){
    var _connector = {
        mongoose:  require('./mongoDb.connector'),
        mySql:  require('./mySql.connector'),
        postgreSql:  require('./postgreSQL.connector'),
        sqlServer:  require('./sql.connector')
    };
    return _connector;
}