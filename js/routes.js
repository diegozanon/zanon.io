angular.module('zanonApp').config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      
      // partials
      .when('/', {
        templateUrl: 'partials/posts.html',
        controller: 'PostsController'
      })	
      .when('/404', {
        templateUrl: 'partials/404.html',
        controller: '404Controller'
      })		  

      // posts
      .when('/angularjs-with-pretty-urls-removing-the-in-amazon-s3', {
        templateUrl: 'posts/2015-08-09-angularjs-with-pretty-urls-removing-the-in-amazon-s3.html'
      })      

      // 404
      .otherwise({
        redirectTo: '/404'
      });

      $locationProvider.html5Mode(true);
  }
]);