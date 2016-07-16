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
  })
  .directive('shareTwitter', function() {
    return {
      link: function(scope, element, attr) {
        setTimeout(function() {
          twttr.widgets.createShareButton(
            attr.url,
            element[0],
            {
              size: attr.size,
              via: attr.via,
              text: attr.text
            }
          );
        });
      }
    };
  });
