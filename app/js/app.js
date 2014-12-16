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
    .when('/', {
      templateUrl: 'partials/globalize.html',
      controller: 'GlobalizeCtrl'
    })
    .otherwise('/');
});
