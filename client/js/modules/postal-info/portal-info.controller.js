/**
 * Created by wizdev on 1/17/2016.
 */
(function(define, angular){
    "use strict";
    define(['chosen'], function () {
        angular.module(window['name'])
            .controller('postalController', ['$scope', '$rootScope', '$q', '$compile', 'postalInfoService',
                function ($scope, $rootScope, $q, $compile, postalInfoService)
                {
                    var _ctrlModel = this;
                    $('#zipSearch').on('input propertychange', function (e) {
                        var _val  =$.trim(e.currentTarget.value);
                        if(_val && 5 <= _val.length){
                            postalInfoService.getPostalInfoByZipCode(_val).then(function(resp){
                                _ctrlModel.regions = resp['data']['region'];
                            },function(){
                                _ctrlModel.regions = {};
                            });
                        }else{
                            _ctrlModel.regions = {};
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }
                    });

                    _ctrlModel.changeRegion = function(id){
                        this.villages = this['regions'][id]['village'];
                    };

                    _ctrlModel.changeVillage = function(id){
                        this.villagePart = this['villages'][id]['villagePart'];
                    };
                    _ctrlModel.changeVillagePart = function(id){
                        this.streets = this['villagePart'][id]['street'];
                    };
                }
            ])
            .service('postalInfoService', ['configUrl', 'ajaxService',
            function (configUrl, ajaxService)
            {
                this.getPostalInfoByZipCode = function (key) {
                    var request = { method: 'GET', url: configUrl.postgreUrl +'postal-info', params:{ zipCode: key} };
                    return ajaxService.http(request);
                };
            }
        ]);
    });

})(window.define, window.angular);