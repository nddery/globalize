angular.module('gz.controllers')
.controller('GlobalizeCtrl', function($scope, $routeParams, config, dataFactory) {
  $scope.industries = config.industries;
  // Set industry according to industryid in route
  angular.forEach($scope.industries, function(industry) {
    if (industry.id === $routeParams.industryid) {
      $scope.industry = industry;
    }
  });

  function setActiveAccount() {
    angular.forEach($scope.accounts, function(value, key) {
      if (value.id === $scope.account.id) {
        $scope.account = value;
        return;
      }
    });
  }

  $scope.$watch('industry', function() {
    dataFactory.getIndustryDataByID($scope.industry.id).then(function(data){
      $scope.accounts = data.accounts;
      $scope.accounts.unshift({name: 'All brands', id: 0});

      // Set according to URL
      angular.forEach($scope.accounts, function(account) {
        if (account.name.slugify() === $routeParams.accountname) {
          $scope.account = account;
        }
      });

      setActiveAccount();
    });
  });

  $scope.$watch('account', function() {
    setActiveAccount();
  });
});
