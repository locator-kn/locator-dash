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
    .directive('areaChart', function () {
        return {
            scope: {
                method: '@',
                queryOptions: '=',
                groupByOptions: '='
            },
            controller: function ($scope, tbkKeen, $timeout) {
                $scope.days = 7;
                $scope.showChart = true;


                $scope.showOptions = $scope.groupByOptions.length > 1;

                if ($scope.groupByOptions.length) {
                    $scope.gb = $scope.groupByOptions[0];
                }

                $scope.chartOptions = {
                    chartArea: {
                        height: "85%",
                        left: "5%",
                        top: "5%",
                        width: "80%"
                    }
                };


                var configuration = {
                    method: $scope.method,
                    opts: $scope.queryOptions
                };

                configuration.opts.timeframe = getTimeframeByDays($scope.days);


                $scope.$watch('days', function (ol, ne) {
                    if (ol !== ne) {
                        $scope.showChart = false;
                        configuration.opts.timeframe = getTimeframeByDays($scope.days);
                        $scope.query = new tbkKeen.Query(configuration.method, configuration.opts);
                        $timeout(function () {
                            $scope.showChart = true;
                        }, 500);
                    }
                });
                if (!$scope.queryOptions || !$scope.method) {
                    throw new Error('Wrong directive usage');
                }
                $scope.timeframe = 'this_7_days';
                function getTimeframeByDays(num_days) {
                    return 'this_' + num_days + '_days';
                }

                $scope.updateGroupByOption = function (option) {
                    if ($scope.gb !== option) {
                        $scope.showChart = false;
                        $scope.gb = option;
                        configuration.opts.groupBy = option;
                        $scope.query = new tbkKeen.Query(configuration.method, configuration.opts);
                        $timeout(function () {
                            $scope.showChart = true;
                        }, 500);
                    }
                };


            },
            templateUrl: 'pages/areaChart.html'
        };
    });
