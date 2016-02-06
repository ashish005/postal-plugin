/**
 * Created by wizdev on 1/15/2016.
 */
(function(window, require){
    "use strict";
    var _basePath={
        libs:'assets/libs/',
        core:'js/core/'
    };
    window['name'] = 'postalApp';
    require.config({
        urlArgs: 'v=1.0',
        waitSeconds: 200,
        // alias libraries paths
        paths: {
            'postalApp':"base",
            jQuery: _basePath.libs +'jquery/jquery-2.1.1.min',
            'jquery-ui':_basePath.libs +'jquery-ui/jquery-ui',
            angular: _basePath.libs +'angular/angular',
            angularAMD:  _basePath.libs +'angular/angularAMD.min',
            ngRoute:  _basePath.libs +'angular/angular-route',
            bootstrap:_basePath.libs +'bootstrap/bootstrap.min',
            'ui-bootstrap':_basePath.libs +'bootstrap/ui-bootstrap-tpls-0.12.0.min',
            'core':_basePath.core +'core',

            'chosenjQuery':_basePath.libs +'plugin/chosen/chosen.jquery',
            'chosen':_basePath.libs +'plugin/chosen/chosen',
        },
        shim: {
            angularAMD: ['angular'],
            angular: {
                exports: "angular"
            },
            ngRoute: {
                deps: ["angular"]
            },
            core:{
                deps: [ 'ngRoute']
            },
            bootstrap:{
                deps:['jQuery']
            },
            'ui-bootstrap':{
                deps: ['jQuery', 'angular']
            },
            chosenjQuery:{
                deps:['jQuery']
            },
            chosen:{
                deps: ['angular', 'chosenjQuery']
            },
            postalApp:{
                deps: ['core', 'angularAMD', 'bootstrap','ui-bootstrap','chosen']
            },
        },
        deps: [window['name']]
    });
})(window, require);