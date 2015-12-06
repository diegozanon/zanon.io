angular.module('zanonApp').config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider

      // partials
      .when('/', {
        templateUrl: '/partials/posts.html',
        controller: 'PostsController'
      })
      .when('/404', {
        templateUrl: '/partials/404.html',
        controller: '404Controller'
      })

      // posts
{{posts}}
      // 404
      .otherwise({
        redirectTo: '/404'
      });

      $locationProvider.html5Mode(true);
  }
]);
