/*global jQuery:true */
'use strict';

angular.module('phonecatApp')
  .controller('SignupCtrl', ['$scope', '$state', 'User', '$timeout', function ($scope, $state, User,$timeout) {
      $scope.username = '';
      $scope.email = '';
      $scope.password = '';
      $scope.agreewithterms = false;
      $scope.errors = [];
      
      function disableSignupButton(message) {
          if (typeof message !== 'string') {
              message = 'Aguarde um momento ...';
          }
          jQuery('#signup-form-submit-button').prop('disabled', true).prop('value', message);
      }

      function enableSignupButton(message) {
          if (typeof message !== 'string') {
              message = 'Submit';
          }
          jQuery('#signup-form-submit-button').prop('disabled', false).prop('value', message);
      }

      function onSuccessfulSignup() {
            startTimer();
            //$state.go('/');
      }

      function onFailedSignup(error) {
          if (typeof error === 'string' && $scope.errors.indexOf(error) === -1) {
              $scope.errors.push(error);
          }
          enableSignupButton();
      }

      var startTimer = function () {
          var timer = $timeout(function () {
              $timeout.cancel(timer);
              $state.go('/login');
          }, 2000);
      }

      $scope.signup = function (isValid) {
          if (isValid) {
              disableSignupButton();
              User.createAccount($scope.username, $scope.password, $scope.email, $scope.agreewithterms, onSuccessfulSignup, onFailedSignup);
          }

      };




  }]);