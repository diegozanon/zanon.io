var zanonApp = angular.module('zanonApp', [
  'ngRoute',
  'ui.bootstrap',
  'zanonControllers',
  'dirDisqus'
]);

zanonApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
        $rootScope.title = current.$$route.title ? current.$$route.title + ' - ' : '';
    });
}]);
