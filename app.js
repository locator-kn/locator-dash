angular.module('locatordash', ['angular-keenio', 'ui.router'])

    .config(function (tbkKeenConfigProvider) {
        tbkKeenConfigProvider.projectId("<%= keen.PROJECT_ID %>");
        tbkKeenConfigProvider.readKey("<%= keen.READ_KEY %>");

    }).config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "pages/home.html",
                controller: 'MainCtrl',
                controllerAs: 'mc'
            })
            .state('locations', {
                url: "/locations",
                templateUrl: "pages/locations.html",
                controller: 'LocationsCtrl',
                controllerAs: 'lc'
            })
    })
    .directive('areaChart', function() {
        return {
            scope: {
                method: '@',
                eventcollection: '@',
                groupBy: '@'
            },
            controller: function($scope, tbkKeen, $timeout) {
                $scope.days = 7;
                $scope.showChart = true;

                $scope.chartOptions = {
                    chartArea: {
                        height: "85%",
                        left: "5%",
                        top: "5%",
                        width: "80%"
                    }
                };

                $scope.$watch('days', function(ol, ne) {
                    if(ol !== ne) {
                        $scope.showChart = false;
                        $timeout(function() {
                            $scope.showChart = true;
                        }, 500)
                    }
                });



                if(!$scope.eventcollection || !$scope.method) {
                    throw new Error('Wrong directive usage');
                }
                $scope.timeframe = 'this_7_days';
                function getTimeframeByDays(num_days) {
                    return 'this_' + num_days + '_days'
                }

                var configuration = {
                    method: $scope.method,
                    opts: {
                        eventCollection: $scope.eventcollection,
                        timeframe: getTimeframeByDays($scope.days),
                        groupBy: "ip_geo_info.city"
                    }
                };

                $scope.query = new tbkKeen.Query(configuration.method, configuration.opts);

            },
            templateUrl: 'pages/areaChart.html'
        };
    });
