// Modules & Dependencies
angular.module('gz.services', []);
angular.module('gz.directives', ['gz.services']);
angular.module('gz.controllers', ['gz.services']);

// Declare app level module which depends on filters, and services
angular.module('gz', [
  'ngRoute',
  'gz.services',
  'gz.directives',
  'gz.controllers'
])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/industry/:industryid/:accountname', {
      templateUrl: 'partials/globalize.html',
      controller: 'GlobalizeCtrl'
    })
    .otherwise('/industry/1/all-brands');

  $locationProvider.hashPrefix('!');
})

// http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
.run(function ($route, $rootScope, $location) {
  var original = $location.path;
  $location.path = function (path, reload) {
    if (reload === false) {
      var lastRoute = $route.current;
      var un = $rootScope.$on('$locationChangeSuccess', function () {
        $route.current = lastRoute;
        un();
      });
    }
    return original.apply($location, [path]);
  };
});

// http://stackoverflow.com/a/1054862
String.prototype.slugify = function() {
  return this.toLowerCase()
             .replace(/[^\w ]+/g,'')
             .replace(/ +/g,'-');
};
