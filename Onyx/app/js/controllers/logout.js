'use strict';

angular.module('phonecatApp')
  .controller('LogoutCtrl', ['$state', 'User', function ($state, User) {
      User.removeAuthentication();
      $state.go('/');
  }]);