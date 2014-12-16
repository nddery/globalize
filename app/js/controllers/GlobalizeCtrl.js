angular.module('gz.controllers')
.controller('GlobalizeCtrl', function($scope, config, dataFactory) {
  $scope.industry = config.industries[0];
  $scope.industries = config.industries;

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
      $scope.account = $scope.accounts[0];
      setActiveAccount();
    });
  });

  $scope.$watch('account', function() {
    setActiveAccount();
  });
});
