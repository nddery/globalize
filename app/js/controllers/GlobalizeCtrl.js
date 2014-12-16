angular.module('gz.controllers')
.controller('GlobalizeCtrl', function($scope, config, dataFactory) {
  $scope.industry = config.industries[0];
  $scope.industryID = $scope.industry.id;
  $scope.industries = config.industries;

  $scope.$watch('industry', function() {
    $scope.industryID = $scope.industry.id;
  });
});
