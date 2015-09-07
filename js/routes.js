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
      .when('/posts/serving-gzipped-files-in-amazon-s3-cloudfront', {
        templateUrl: '/partials/posts/2015-09-06-serving-gzipped-files-in-amazon-s3-cloudfront.html'
      }) 
      .when('/posts/angularjs-how-to-create-a-spa-crawlable-and-seo-friendly', {
        templateUrl: '/partials/posts/2015-08-23-angularjs-how-to-create-a-spa-crawlable-and-seo-friendly.html'
      }) 
      .when('/posts/angularjs-with-pretty-urls-removing-the-in-amazon-s3', {
        templateUrl: '/partials/posts/2015-08-09-angularjs-with-pretty-urls-removing-the-in-amazon-s3.html'
      })            

      // 404
      .otherwise({
        redirectTo: '/404'
      });

      $locationProvider.html5Mode(true);
  }
]);