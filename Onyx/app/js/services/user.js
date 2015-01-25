'use strict';

angular.module('phonecatApp')
  .service('User', ['$http', '$cookieStore','localStorageService','$state','$timeout', function User($http, $cookieStore, localStorage,$state,$timeout) {

      
      function NoAuthenticationException(message) {
          this.name = 'AuthenticationRequired';
          this.message = message;
      }

      function NextStateUndefinedException(message) {
          this.name = 'NextStateUndefined';
          this.message = message;
      }

      function AuthenticationExpiredException(message) {
          this.name = 'AuthenticationExpired';
          this.message = message;
      }

      function AuthenticationRetrievalException(message) {
          this.name = 'AuthenticationRetrieval';
          this.message = message;
      }

      var userData = {
          isAuthenticated: false,
          userName: '',
          access_token: '',
          refresh_token: '',
          '.expires': null,
      };

      var nextState = {
          name: '',
          error: ''
      };

      function isAuthenticationExpired(expires) {
          var now = new Date();
          expires = new Date(expires);
          if (expires - now > 0) {
              return false;
          } else {
              return true;
          }
      }

      function saveData() {
          removeData();
          localStorage.set('auth_data', userData);
      }

      function removeData() {
          
          localStorage.remove('auth_data');
      }

      function retrieveSavedData() {
          var savedData = localStorage.get('auth_data'); 
          if (typeof savedData === 'undefined') {
              throw new AuthenticationRetrievalException('No authentication data exists');
          } else if (isAuthenticationExpired(savedData['.expires'])) {
              throw new AuthenticationExpiredException('Authentication token has already expired');
          } else {
              userData = savedData;
              setHttpAuthHeader();
          }
          
      }

      this.refreshToken = function (successCallback) {

          var savedData = localStorage.get('auth_data');
          if (typeof savedData === 'undefined') {
              throw new AuthenticationRetrievalException('No authentication data exists');
          }
          
          if (savedData.refresh_token === 'undefined') { throw new AuthenticationExpiredException('Refresh token has already expired'); }
          
          var config = {
              method: 'POST',
              url: 'http://authorization.onyximports.com.br/token',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              data: 'grant_type=refresh_token&client_id=ngAuthApp&refresh_token=' + savedData.refresh_token,
          };

          $http(config)
            .success(function (data) {

                userData.isAuthenticated = true;
                userData.userName = data.userName;
                userData.access_token = data.access_token;
                userData.refresh_token = data.refresh_token;
                userData.expires_in = data.expires_in;
                userData.client_id = data['as:client_id'];
                userData['.issued'] = new Date(data['.issued']);
                userData['.expires'] = new Date(data['.expires']);

                saveData();

                setHttpAuthHeader();

                if (typeof successCallback === 'function') {
                    successCallback();
                }

            })
            .error(function () {
                //an error accured when trying to refresh the token so user must login again with username and password
                throw new AuthenticationExpiredException('Authentication token has already expired');
            });
      };

      function clearUserData() {
          userData.isAuthenticated = false;
          userData.userName = '';
          userData.access_token = '';
          userData.refresh_token = '';
          userData['.expires'] = null;
      }

      function setHttpAuthHeader() {
          $http.defaults.headers.common.Authorization = 'Bearer ' + userData.access_token;
      }

      this.isAuthenticated = function () {
          if (userData.isAuthenticated && !isAuthenticationExpired(userData['.expires'])) {
              return true;
          } else {
              try {
                  retrieveSavedData();
              } catch (e) {
                  throw new NoAuthenticationException('Authentication not found');
              }
              return true;
          }
      };

      this.getNextState = function () {
          if (nextState.name === '') {
              throw new NextStateUndefinedException('No state data was set');
          } else {
              return nextState;
          }
      };

      this.setNextState = function (name, error) {
          nextState.name = name;
          nextState.error = error;
      };

      this.clearNextState = function () {
          nextState.name = '';
          nextState.error = '';
      };

      this.getUserData = function () {
          return userData;
      };
      
      this.removeAuthentication = function () {
          removeData();
          clearUserData();
          $http.defaults.headers.common.Authorization = null;
      };

      this.authenticate = function (userName, password, successCallback, errorCallback, persistData) {
          this.removeAuthentication();
          var config = {
              method: 'POST',
              url: 'http://authorization.onyximports.com.br/token',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              data: 'grant_type=password&username=' + userName + '&password=' + password + '&client_id=ngAuthApp'
          };

          $http(config)
            .success(function (data) {
                
                //userData = data;
                userData.isAuthenticated = true;
                userData.userName = data.userName;
                userData.access_token = data.access_token;
                userData.refresh_token = data.refresh_token;
                userData.expires_in = data.expires_in;
                userData.client_id = data['as:client_id'];
                userData['.issued'] = new Date(data['.issued']);
                userData['.expires'] = new Date(data['.expires']);
                
                setHttpAuthHeader();

                if (persistData === true) {
                    saveData();
                }
                if (typeof successCallback === 'function') {
                    successCallback();
                }
            })
            .error(function (data) {
                if (typeof errorCallback === 'function') {
                    if (data.error_description) {
                        errorCallback(data.error_description);
                    } else {
                        errorCallback('Unable to contact server; please, try again later.');
                    }
                }
            });
      };


      this.createAccount = function (userName, password, email, agreewithterms, successCallback, errorCallback) {
          this.removeAuthentication();
          var config = {
              method: 'POST',
              url: 'http://authorization.onyximports.com.br/api/account/register',
              headers: {
                  'Content-Type': 'application/json', // x-www-form-urlencoded
              },
              data: { UserName: userName, Password: password, ConfirmPassword: password, Email: email }
          };

          $http(config)
            .success(function (data) {

                if (typeof successCallback === 'function') {
                    successCallback();
                }
            })
            .error(function (data) {
                if (typeof errorCallback === 'function') {
                    if (data.error_description) {
                        errorCallback(data.error_description);
                    } else {
                        errorCallback('Unable to contact server; please, try again later.');
                    }
                }
            });
      };

      

  }]);