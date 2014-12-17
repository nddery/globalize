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

.config(function($routeProvider) {
  $routeProvider
    .when('/industry/:industryid', {
      templateUrl: 'partials/globalize.html',
      controller: 'GlobalizeCtrl'
    })
    .when('/industry/:industryid/:accountname', {
      templateUrl: 'partials/globalize.html',
      controller: 'GlobalizeCtrl'
    })
    .otherwise('/industry/1/all-brands');
});

// http://stackoverflow.com/a/5782563
String.prototype.slugify = function() {
  return this.toLowerCase()
             .replace(/[^\w ]+/g,'')
             .replace(/ +/g,'-');
};
