angular.module('locatordash')
    .controller('LocationsCtrl', ['$scope', 'tbkKeen', '$timeout', function($scope, tbkKeen, $timeout) {
        var that = this;
        $scope.greeting = 'Hola!';
        this.timeframe = 'this_7_days';
        this.rerender = true;


        $scope.$watch(angular.bind(this, function () {
            return this.timeframe; // `this` IS the `this` above!!
        }), function (newVal, oldVal) {
            drawCharts();
            that.rerender = false;
        });





        function drawCharts() {
            that.query = new tbkKeen.Query("count", {
                eventCollection: "visit",
                timeframe: that.timeframe,
                groupBy: "ip_geo_info.city"
            });

            that.chartOptions = {
                chartArea: {
                    height: "85%",
                    left: "5%",
                    top: "5%",
                    width: "80%"
                },
                isStacked: true
            };
            $timeout(function() {
                that.rerender = true;
            }, 1000);
        }

        drawCharts()

    }]);

