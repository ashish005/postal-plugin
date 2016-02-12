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

            var results = [];
            // SQL Query > Select Data
            var query = client.query(" SELECT " +
                " v.psc as region_id, po.nazev as region, co.cobce_kod as village2_id, co.nazev as village2, o.obec_kod as village1_id, o.nazev as village1, u.nazev as streets, mc.nazev as mcast  " +
                "FROM adresy2.vazba AS v INNER JOIN adresy2.cobce AS co ON co.cobce_kod = v.cobce_kod INNER JOIN adresy2.obec AS o ON o.obec_kod = co.obec_kod LEFT JOIN adresy2.ulice AS u ON u.ulice_kod = v.ulice_kod LEFT JOIN adresy2.mcast AS mc ON mc.obec_kod = o.obec_kod LEFT JOIN adresy2.posta AS po ON po.psc = v.psc where v.psc = "+req.query['zipCode']);

            /*var _okres = " select ok.okres_kod, ok.nazev as country4, ok.nuts4 as nuts4 , kr.kraj_kod, kr.nuts3 as nuts3, kr.nazev as country3,ob.oblast_kod, ob.nuts2 as nuts2, ob.nazev as country2 from adresy2.okres as ok JOIN adresy2.kraj AS kr ON kr.kraj_kod = ok.kraj_kod JOIN adresy2.oblast AS ob ON kr.oblast_kod = ob.oblast_kod ";
            var _obec = " select ob.obec_kod, ob.nazev as village, ob.nuts5 as nuts5,okr.*, ob.pou_kod from adresy2.obec AS ob join ( " + _okres + " ) as okr ON ob.okres_kod= okr.okres_kod ";
            var _obe = " select obe.*, pou.pou_kod, pou.orp_kod, pou.nazev as town from ( " + _obec + " )  as obe JOIN adresy2.pou AS pou ON obe.pou_kod = pou.pou_kod ";
            var _cobce =" select co.cobce_kod, co.nazev as town_cobce, ob_po.* from adresy2.cobce co join ( " + _obe + " ) as ob_po on co.obec_kod = ob_po.obec_kod ";

            // SQL Query > Select Data
            var query = client.query(" select * FROM adresy2.vazba as va join ( " + _cobce + " ) as cob_po on va.cobce_kod = cob_po.cobce_kod where va.psc = " + req.query['zipCode']);*/
            // Stream results back one row at a time
            /*var respModel = {
                region:[],
                village1:[],
                village2:[],
                street:[],
                other:[]
            };*/
            var respModel = {
                region:{
                }
            };

            query.on('row', function(row) {
                if(!respModel['region'][row['region_id']] || null === respModel['region'][row['region_id']]){
                    respModel['region'][row['region_id']] = {
                        name:row['region'],
                        village:{}
                    };
                }
                var _region = respModel['region'][row['region_id']];

                if(!_region['village'][row['village1_id']] || null === _region['village'][row['village1_id']]){
                    _region['village'][row['village1_id']] = {
                        name:row['village1'],
                        villagePart:{}
                    };
                };
                var _respVillage = _region['village'][row['village1_id']];

                if(!_respVillage['villagePart'][row['village2_id']] || null === _respVillage['villagePart'][row['village2_id']]){
                    _respVillage['villagePart'][row['village2_id']] = {
                        name:row['village2'],
                        street:[]
                    };
                };
                var _respVillagePart =  _respVillage['villagePart'][row['village2_id']];

                if(_respVillagePart.street.indexOf(row['streets'])==-1) {
                    _respVillagePart.street.push(row['streets']);
                }
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                next();
                return res.json({ success: true, data: respModel});
            });


        });
    });

    server.use('/api', router);
    return router;
}