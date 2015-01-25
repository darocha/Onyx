'use strict';

angular.module('phonecatApp')
  .controller('SalesDataCtrl', ['$scope', '$resource', function ($scope, $resource) {
      $scope.salesSummaryByRegion = $resource('http://authorization.onyximports.com.br/api/regions/summary').query();
  }]);