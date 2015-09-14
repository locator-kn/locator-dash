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
    .directive('chart', function () {
        return {
            scope: {
                method: '@',
                queryOptions: '=',
                groupByOptions: '=',
                chartTitle: '@',
                type: '@'
            },
            controller: function ($scope, tbkKeen, $timeout) {
                tbkKeen.ready(function () {

                    $scope.days = 7;
                    $scope.showChart = true;


                    $scope.showOptions = $scope.groupByOptions && $scope.groupByOptions.length > 1;

                    if ($scope.groupByOptions && $scope.groupByOptions.length) {
                        $scope.gb = $scope.groupByOptions[0];
                    }
                    if ($scope.type === 'area') {

                        $scope.chartOptions = {
                            chartArea: {
                                height: "85%",
                                left: "5%",
                                top: "5%",
                                width: "80%"
                            }
                        };
                    } else if ($scope.type === 'pie') {
                        $scope.chartOptions = {
                            chartArea: {
                                height: "85%",
                                left: "5%",
                                top: "5%",
                                width: "100%"
                            },
                            pieHole: .4
                        };
                    } else if ($scope.type === 'metric') {
                        $scope.chartOptions = {
                            title: "Registrations",
                            colors: ["#49c5b1"]
                        };
                    }


                    var configuration = {
                        method: $scope.method,
                        opts: $scope.queryOptions
                    };

                    configuration.opts.timeframe = getTimeframeByDays($scope.days);


                    $scope.$watch('days', function (ol, ne) {
                        if (ol !== ne) {
                            $scope.showChart = false;
                            configuration.opts.timeframe = getTimeframeByDays($scope.days);
                            performQuery();
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
                            performQuery();
                            $timeout(function () {
                                $scope.showChart = true;
                            }, 500);
                        }
                    };

                    function performQuery() {
                        $scope.query = new tbkKeen.Query(configuration.method, configuration.opts);
                    }

                    performQuery();
                    $scope.$apply();

                });
            },
            templateUrl: 'pages/areaChart.html'
        };
    });
