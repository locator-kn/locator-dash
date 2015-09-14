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
