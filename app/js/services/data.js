angular.module('gz.services')
  .factory('gzCache', function($cacheFactory) {
    return $cacheFactory('data');
  })

  .factory('dataFactory', function($http, $q, $filter, gzCache) {
    var getIndustryDataByID = function(industryID) {
      var deferred = $q.defer();

      industryID = typeof parseInt(industryID) === 'number' ? parseInt(industryID) : 1;

      $http.get('data/industries/industry_' + industryID + '.json', {cache: gzCache})
        .success(function(data) {
          deferred.resolve(data);
        }).error(function(){
          deferred.reject();
        });

      return deferred.promise;
    };

    var getCountryTopoJSON = function() {
      var deferred = $q.defer();

      $http.get('data/countries.topo.json', {cache: gzCache})
        .success(function(data) {
          deferred.resolve(data);
        }).error(function(){
          deferred.reject();
        });

      return deferred.promise;
    };

    return {
       getIndustryDataByID: getIndustryDataByID
      ,getCountryTopoJSON: getCountryTopoJSON
    };
  });
