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
                        if(_val && 6 == _val.length){
                            postalInfoService.getPostalInfoByZipCode(_val).then(function(resp){
                                _ctrlModel.village = resp;
                                _ctrlModel.villagePart = resp;
                                _ctrlModel.street = resp;
                            },function(){
                                _ctrlModel.village = [];
                                _ctrlModel.villagePart = [];
                                _ctrlModel.street = [];
                            });
                        }else{
                            _ctrlModel.village = [];
                            _ctrlModel.villagePart = [];
                            _ctrlModel.street = [];
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }
                    });
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