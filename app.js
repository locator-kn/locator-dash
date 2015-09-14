angular.module('locatordash', ['ui.router'])
    .factory('KeenS', function () {
        return new Keen({
            projectId: "<%= keen.PROJECT_ID %>",
            readKey: "<%= keen.READ_KEY %>"
        });
    });
