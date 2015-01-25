/*global jQuery:true */
'use strict';

angular.module('phonecatApp')
  .controller('LoginCtrl', ['$scope', '$state', 'User', function ($scope, $state, User) {
      $scope.username = '';
      $scope.password = '';
      $scope.persist = true;
      $scope.errors = [];
      var nextState = null;

      try {
          nextState = User.getNextState();
      } catch (e) {
          nextState = null;
      }

      if (nextState !== null) {
          var nameBuffer = nextState.name + '';
          var errorBuffer = nextState.error + '';
          User.clearNextState();
          nextState = {
              name: nameBuffer,
              error: errorBuffer
          };
          if (typeof nextState.error === 'string' && nextState.error !== '' && $scope.errors.indexOf(nextState.error) === -1) {
              $scope.errors.push(nextState.error);
          } else {
              $scope.errors.push('You must be logged in to view this page');
          }
      }

      function disableLoginButton(message) {
          if (typeof message !== 'string') {
              message = 'Verificando login ...';
          }
          jQuery('#login-form-submit-button').prop('disabled', true).prop('value', message);
      }

      function enableLoginButton(message) {
          if (typeof message !== 'string') {
              message = 'Submit';
          }
          jQuery('#login-form-submit-button').prop('disabled', false).prop('value', message);
      }

      function onSuccessfulLogin() {

          // $scope.user = User.getUserData();
          
          if (nextState !== null && typeof nextState.name === 'string' && nextState.name !== '') {
              $state.go(nextState.name, nextState.params);
          } else {
              $state.go('/');
          }
      }

      function onFailedLogin(error) {
          if (typeof error === 'string' && $scope.errors.indexOf(error) === -1) {
              $scope.errors = [];
              $scope.errors.push(error);
          }
          enableLoginButton();
      }

      $scope.login = function () {
          disableLoginButton();
          User.authenticate($scope.username, $scope.password, onSuccessfulLogin, onFailedLogin, $scope.persist);
      };
  }]);