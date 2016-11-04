angular.module('zanonApp').config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider

      // partials
      .when('/', {
        templateUrl: '/partials/posts.html',
        controller: 'PostsController',
        title: ''
      })
      .when('/404', {
        templateUrl: '/partials/404.html',
        controller: '404Controller',
        title: 'Page not Found'
      })

      // posts
      .when('/posts/nosql-injection-in-mongodb', {
        templateUrl: '/partials/2016-07-17-nosql-injection-in-mongodb.html',
        title: 'NoSQL Injection in MongoDB'
      })
      .when('/posts/please-try-again-retry-pattern-in-node', {
        templateUrl: '/partials/2016-04-09-please-try-again-retry-pattern-in-node.html',
        title: '"Please, try again..." (Retry Pattern in Node)'
      })
      .when('/posts/building-serverless-websites-on-aws-tutorial', {
        templateUrl: '/partials/2016-01-31-building-serverless-websites-on-aws-tutorial.html',
        title: 'Building Serverless Websites on AWS - Tutorial'
      })
      .when('/posts/building-serverless-websites-on-aws-intro', {
        templateUrl: '/partials/2015-11-15-building-serverless-websites-on-aws-intro.html',
        title: 'Building Serverless Websites on AWS - Intro'
      })
      .when('/posts/mongodb-storage-engine-mmap-or-wiredtiger', {
        templateUrl: '/partials/2015-10-18-mongodb-storage-engine-mmap-or-wiredtiger.html',
        title: 'MongoDB storage engine: MMAP or WiredTiger?'
      })
      .when('/posts/how-to-distribute-your-enterprise-mobile-app', {
        templateUrl: '/partials/2015-10-04-how-to-distribute-your-enterprise-mobile-app.html',
        title: 'How to distribute your enterprise mobile app?'
      })
      .when('/posts/creating-desktop-apps-using-html-css-js-nodejs-with-nwjs', {
        templateUrl: '/partials/2015-09-20-creating-desktop-apps-using-html-css-js-nodejs-with-nwjs.html',
        title: 'Creating Desktop Apps using HTML/CSS/JS + Node.js with NW.js'
      })
      .when('/posts/serving-gzipped-files-in-amazon-s3-cloudfront', {
        templateUrl: '/partials/2015-09-06-serving-gzipped-files-in-amazon-s3-cloudfront.html',
        title: 'Serving gzipped files in Amazon S3 / CloudFront'
      })
      .when('/posts/angularjs-how-to-create-a-spa-crawlable-and-seo-friendly', {
        templateUrl: '/partials/2015-08-23-angularjs-how-to-create-a-spa-crawlable-and-seo-friendly.html',
        title: 'AngularJS: How to create a SPA crawlable and SEO friendly?'
      })
      .when('/posts/angularjs-with-pretty-urls-removing-the-in-amazon-s3', {
        templateUrl: '/partials/2015-08-09-angularjs-with-pretty-urls-removing-the-in-amazon-s3.html',
        title: 'AngularJS with Pretty URLs: Removing the # in Amazon S3'
      })
      .when('/posts/getting-started', {
        templateUrl: '/partials/2015-07-26-getting-started.html',
        title: 'Getting Started!'
      })

      // 404
      .otherwise({
        redirectTo: '/404'
      });

      $locationProvider.html5Mode(true);
  }
]);
