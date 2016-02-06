/**
 * Created by wizdev on 1/15/2016.
 */
(function(define, angular){
    "use strict";
    var _mod = window['name'] + '.core';
    var core = angular.module(_mod, ['ui.bootstrap', 'ngRoute']);

    var _coreBase = 'js/core/templates/';
    var _viewOptions = {
        login: {
            templateUrl: _coreBase + 'login.html'
        },
        register: {
            templateUrl: _coreBase + 'register.html'
        },
        forgot_password: {
            templateUrl: _coreBase + 'forgot_password.html'
        },
        400:{
            templateUrl: _coreBase + 'error/404.html'
        },
        500:{
            templateUrl: _coreBase + 'error/500.html'
        },
    };

    function popupService($q, modalService) {
        var modalDefaults = { backdrop: true, keyboard: true, modalFade: true, templateUrl: '', windowClass: 'default-popup' };
        var _model = {};
        _model.showPopup = function (templateUrl, model) {
            modalDefaults['templateUrl'] = templateUrl;
            return modalService.showModal(modalDefaults, model);
        };
        return _model;
    }

    function modalService($modal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '',
            windowClass: ''
        };
        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }
            return $modal.open(tempModalDefaults).result;
        };
    }

    function goLiveHeader($location){
        return {
            restrict: 'AE',
            templateUrl:_viewOptions.headerTemplateUrl,
            link: function(scope, element, attr){
                element.on('click', '#clearInfo', function(e){
                    e.stopPropagation();
                })
            }
        };
    };

    function authenticationFactory($window) {
        var auth = {
            isLogged: false,
            userInfo:{
                name: '',
                email: '',
                mobile:'',
                role: '',
                pic:'',
                isAuthenticated  : false,
            },
            check: function () {
                if ($window.localStorage.token && $window.localStorage.email)
                {
                    this.isLogged = true;
                } else {
                    this.isLogged = false;
                    delete this.user;
                }
            },
            getInfo: function (user) {
                this.setAuthInfoFromStorage();
                return this.userInfo;
            },
            setInfo: function (user) {
                this.userInfo['name'] = user['name'];
                this.userInfo['email'] = user['email'];
                this.userInfo['role'] = user['role'];
                this.userInfo['mobile'] = user['mobile'];
                this.userInfo['token']  = user['token'];
                this.userInfo['pic']  = user['pic'];
                this.userInfo['isAuthenticated'] = user['isVerified'];

                $window.localStorage.token = this.userInfo['token'];
                $window.localStorage.name = this.userInfo['name'];
                $window.localStorage.email = this.userInfo['email'];
                $window.localStorage.role = this.userInfo['role'];
                $window.localStorage.mobile = this.userInfo['mobile'];
                $window.localStorage.pic = this.userInfo['pic'];
                $window.localStorage.isAuthenticated = this.userInfo['isAuthenticated'];
            },
            setAuthInfoFromStorage: function () {
                this.userInfo['name'] =  $window.localStorage.name;
                this.userInfo['email'] = $window.localStorage.email;
                this.userInfo['role'] = $window.localStorage.role;
                this.userInfo['mobile'] = $window.localStorage.mobile;
                this.userInfo['token']  = $window.localStorage.token;
                this.userInfo['pic'] = $window.localStorage.pic;
                this.userInfo['isAuthenticated'] = $window.localStorage.isAuthenticated;
            },
            clearInfo: function () {
                this.isLogged = false;

                delete this.userInfo['name'];
                delete this.userInfo['email'];
                delete this.userInfo['role'];
                delete this.userInfo['mobile'];
                delete this.userInfo['token'];
                delete this.userInfo['pic'];
                delete this.userInfo['isAuthenticated'];

                //Remove window session storage code
                delete $window.localStorage.token;
                delete $window.localStorage.name;
                delete $window.localStorage.email;
                delete $window.localStorage.role;
                delete $window.localStorage.mobile;
                delete $window.localStorage.pic;
                delete $window.localStorage.isAuthenticated;
            },
            getAuthToken: function () {
                return 'Bearer ' + $window.localStorage.token;
            }
        }
        return auth;
    }

    function tokenInterceptor($q, $location, authenticationFactory) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer'+ authenticationFactory.getAuthToken();
                return config;
            },
            requestError: function (rejection) {
                return $q.reject(rejection);
            },
            /* Set Authentication.isAuthenticated to true if 200 received */
            response: function (response) {
                if (response != null && response.status == 200 && authenticationFactory.getAuthToken() && !authenticationFactory.isAuthenticated) {
                    authenticationFactory.isAuthenticated = true;
                }
                return response || $q.when(response);
            },
            /* Revoke client authentication if 401 is received */
            responseError: function (rejection) {
                if (rejection != null && rejection.status === 401 && (authenticationFactory.getAuthToken() || authenticationFactory.isAuthenticated)) {
                    //delete $window.localStorage.token;//Remove window session storage code
                    authenticationFactory.clearInfo();
                    authenticationFactory.isAuthenticated = false;
                    $location.path("/login");
                }
                return $q.reject(rejection);
            }
        };
    }

    function authController($scope, $rootScope, $http, $location, authenticationFactory) {
        $scope.submitLoginForm = function() {
            var _req = {method: 'POST', url: 'api/core/signin', data:[ ]};
            ajaxRequest(_req, function(data, status, headers, config) {
                authenticationFactory.setInfo(data['data']);
            }, function(data, status, headers, config) {
                console.log('error: ', data );// this callback will be called asynchronously when the response is available.
            });
        };

        function ajaxRequest(request ,successCallback, errorCallback){
            $http(request).success(successCallback).error(errorCallback);
        }
    }

    function ajaxService($http, $q, $timeout) {
        this.http = function (request) {
            request.cache = false;
            var deferred = $q.defer();
            $http(request).success(function (response) {
                deferred.resolve(response);
            }).error(function (xhr, status, error, exception) {
                deferred.reject(xhr);
            });
            return deferred.promise;
        }
    }

    core
        .factory("popupService", ['$q', "modalService", popupService])
        .service("modalService", ["$modal", modalService])
        .factory('authenticationFactory', ["$window", authenticationFactory])
        .factory('tokenInterceptor', ['$q', '$location', 'authenticationFactory', tokenInterceptor])
        .service('ajaxService', ['$http', '$q', '$timeout', ajaxService])
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/login', _viewOptions['login'])
                .when('/register', _viewOptions['register'])
                .when('/forgot_password', _viewOptions['forgot_password'])
                .when('/400', _viewOptions['400'])
                .when('/500', _viewOptions['500'])
        }])
        .controller('authController', ['$scope', '$rootScope', '$http', '$location', 'authenticationFactory', authController])
})(window.define, window.angular);
