/**
 * Created by Ashish on 1/15/2016.
 */
module.exports = function(server, express, connector) {
    var router = express.Router();

    router.get('/', function(req, res) {
        res.send('respond with a resource');
    });
    router.get('/postal-info', function(req, res) {
        var db = connector.postgreSql;
        db.connect(db.connectionString, function(err, client, next) {
            if(err) {
                next();
                console.log(err);
                return res.status(500).json({ success: false, data: err});
            }

            // SQL Query > Select Data
            var query = client.query("SELECT * FROM items ORDER BY id ASC");

            // After all data is returned, close connection and return results
            query.on('end', function() {
                next();
                return res.json({ success: false, data: []});
            });


        });
        //db.connect(function(err, client){
        //    console.log(err['message']);
        //    if(err) {
        //      return res.status(400).send(err);
        //    }
        //        var query = client.query('select * from zmen_zaz');
        //        query.on('end', function () {
        //            client.end();
        //        });
        //       return res.status(200).send('ashish');
        //
        //});

        /*var states = [
            'Alabama',
            'Alaska',
            'Arizona',
            'Arkansas',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'Florida',
            'Georgia',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Minnesota',
            'Mississippi',
            'Missouri',
            'Montana',
            'Nebraska',
            'Nevada',
            'New Hampshire',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'Pennsylvania',
            'Rhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
            'Wyoming'
        ];
        res.send(states);*/
    });

    server.use('/api', router);
    return router;
}