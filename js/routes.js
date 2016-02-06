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
      .when('/posts/building-serverless-websites-on-aws-tutorial', {
        templateUrl: '/partials/2016-01-31-building-serverless-websites-on-aws-tutorial.html'
      })
      .when('/posts/building-serverless-websites-on-aws-intro', {
        templateUrl: '/partials/2015-11-15-building-serverless-websites-on-aws-intro.html'
      })
      .when('/posts/realm-an-incredible-fast-mobile-db', {
        templateUrl: '/partials/2015-11-01-realm-an-incredible-fast-mobile-db.html'
      })
      .when('/posts/mongodb-storage-engine-mmap-or-wiredtiger', {
        templateUrl: '/partials/2015-10-18-mongodb-storage-engine-mmap-or-wiredtiger.html'
      })
      .when('/posts/how-to-distribute-your-enterprise-mobile-app', {
        templateUrl: '/partials/2015-10-04-how-to-distribute-your-enterprise-mobile-app.html'
      })
      .when('/posts/creating-desktop-apps-using-html-css-js-nodejs-with-nwjs', {
        templateUrl: '/partials/2015-09-20-creating-desktop-apps-using-html-css-js-nodejs-with-nwjs.html'
      })
      .when('/posts/serving-gzipped-files-in-amazon-s3-cloudfront', {
        templateUrl: '/partials/2015-09-06-serving-gzipped-files-in-amazon-s3-cloudfront.html'
      })
      .when('/posts/angularjs-how-to-create-a-spa-crawlable-and-seo-friendly', {
        templateUrl: '/partials/2015-08-23-angularjs-how-to-create-a-spa-crawlable-and-seo-friendly.html'
      })
      .when('/posts/angularjs-with-pretty-urls-removing-the-in-amazon-s3', {
        templateUrl: '/partials/2015-08-09-angularjs-with-pretty-urls-removing-the-in-amazon-s3.html'
      })
      .when('/posts/getting-started', {
        templateUrl: '/partials/2015-07-26-getting-started.html'
      })

      // 404
      .otherwise({
        redirectTo: '/404'
      });

      $locationProvider.html5Mode(true);
  }
]);
