angular.module('locatordash', ['ui.router'])
    .factory('KeenS', function () {
        return new Keen({
            projectId: "<%= keen.PROJECT_ID %>",
            readKey: "<%= keen.READ_KEY %>"
        });
    }).config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "pages/home.html"
            })
    });
