angular.module('gz.directives')
  .directive('about', function() {
    return {
      restrict: 'E'
      ,replace: true
      ,transclude: true
      ,templateUrl: 'partials/about.html'
    };
  })

  .directive('colophon', function() {
    return {
      restrict: 'E'
      ,replace: true
      ,transclude: true
      ,templateUrl: 'partials/colophon.html'
    };
  });
