'use strict';

angular.module('phonecatApp')
  .controller('ProtectedDataCtrl', ['$scope', '$resource', function ($scope, $resource) {
      $scope.protectedData = $resource('http://onyximports.com.br/api/protected').query();
  }]);