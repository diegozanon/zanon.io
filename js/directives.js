angular.module('zanonApp')
  .directive('highlightCode', function() {
    return {
      restrict: "A",
      link: function(scope, elem, attrs) {
        scope.$on('$routeChangeSuccess', function (scope, next, current) {          
          var els = angular.element('pre code');
          angular.forEach(els, function(el) {
            hljs.highlightBlock(el);            
          });
        });
      }
    };
  });