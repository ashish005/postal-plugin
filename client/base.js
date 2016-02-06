/**
 * Created by wizdev on 1/15/2016.
 */
(function (angularAMD) {
    var appName = window['name'];
    var _core = window['name'] + '.core';
   var app = angular.module(appName, [_core, 'ngRoute', 'localytics.directives']);

    var _baseUrl = {
        modules:'js/modules/',
        common:'js/modules/common/',
        libPlugins:'assets/libs/plugins/'
    };

    var _viewOptions ={
        'postalInfo':{
            templateUrl: _baseUrl['modules'] +'postal-info/postal-info.html',
            controllerUrl: _baseUrl['modules'] +'postal-info/portal-info.controller'
        }
    };

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/postal-info', angularAMD.route(_viewOptions.postalInfo))
            .otherwise({redirectTo: '/login'});
    }

    function topnavbar(){
        return {
            restrict: 'AE',
            templateUrl:_baseUrl['common'] + 'topnavbar.html',
            link: function(scope, element, attr){}
        };
    };
    function apFooter(){
        return {
            restrict: 'AE',
            templateUrl:_baseUrl['common'] + 'footer.html',
            link: function(scope, element, attr){
            }
        };
    };
    function angularHelper( $controllerProvider, $provide, $compileProvider ) {
        // Let's keep the older references.
        app._controller = app.controller;
        app._service = app.service;
        app._factory = app.factory;
        app._value = app.value;
        app._directive = app.directive;

        // Provider-based controller.
        app.controller = function( name, constructor ) {
            $controllerProvider.register( name, constructor );
            return(this);
        };

        // Provider-based service.
        app.service = function( name, constructor ) {
            $provide.service( name, constructor );
            return(this);
        };

        // Provider-based factory.
        app.factory = function( name, factory ) {
            $provide.factory( name, factory );
            return(this);
        };

        // Provider-based value.
        app.value = function( name, value ) {
            $provide.value( name, value );
            return(this);
        };
        // Provider-based directive.
        app.directive = function( name, factory ) {
            $compileProvider.directive( name, factory );
            return(this);
        };
    }
    app
        .config(angularHelper)
        .config(['$routeProvider', '$locationProvider',config])
        .directive('topNavbar', topnavbar)
        .directive('apFooter', apFooter)
        .run(['$rootScope', function($rootScope) {
            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {});
            $rootScope.$on('$viewContentLoaded', function () {});
        }]);

    angular.element(document).ready(function () {
        var _configUrl = {
            postgreUrl:"http://127.0.0.1:4001/api/"
        };
        app.constant('configUrl', _configUrl);
        $('<div ng-view></div>').appendTo('body');
        return angular.bootstrap($('body'), [appName]);
    });
})(require('angularAMD'));