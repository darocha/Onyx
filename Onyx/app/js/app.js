'use strict';

var page = 1;
var pagesize = 40;
var maxpage = 0;

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'phonecatAnimations',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices',
  'LocalStorageModule',
  'flow',
  'ngCart',
  'ui.router',
  'ng-iscroll',
  'ng-iscroll-slideshow',
  'angular-loading-bar',
  'toaster'
  ]);



phonecatApp.config(['flowFactoryProvider', flowConfig]);  

phonecatApp.config(

        function($stateProvider, $urlRouterProvider, $locationProvider) {
            
            
            $urlRouterProvider.otherwise('/');
            $locationProvider.html5Mode(true);

            //$locationProvider.hashPrefix('!');
               
            // set state only if user is authenticated 
            var resolve =  { user: 'User', authenticationRequired: function(user) {user.isAuthenticated();}};

            var states = [
                              { name: '/', url: '/', templateUrl: '/app/partials/home.html', controller: 'MainCtrl' },
                              { name: '/cart', url: '/cart', templateUrl: '/app/partials/cart.html', controller: 'CartCtrl'},
                              { name: '/categories', url: '/categories', templateUrl: '/app/partials/phone-list.html', controller: 'PhoneListCtrl' },
                              { name: '/phones', url: '/phones', templateUrl: '/app/partials/phone-list.html', controller: 'PhoneListCtrl' },
                              { name: '/phones/:phoneId', url: '/phones/:phoneId', templateUrl: '/app/partials/phone-detail.html', controller: 'PhoneDetailCtrl' },
                              { name: '/about', url: '/about', templateUrl: '/app/partials/about.html'},
                              { name: '/contact', url: '/contact', templateUrl: '/app/partials/contact.html' },
                              { name: '/upload', url: '/upload', templateUrl: '/app/upload.html', resolve: resolve, data: { requireLogin: true } },

                              { name: '/protected', url: '/protected', templateUrl: '/app/js/views/protected-data.html', controller: 'ProtectedDataCtrl', resolve: resolve},
                              { name: '/sales', url: '/sales', templateUrl: '/app/js/views/sales-data.html', controller: 'SalesDataCtrl', resolve: resolve },
                              { name: '/charts', url: '/charts', templateUrl: '/app/js/views/sales-charts.html', controller: 'SalesDataCtrl', resolve: resolve },
                             
                              { name: '/login', url: '/login', templateUrl: '/app/js/views/login-form.html', controller: 'LoginCtrl' },
                              { name: '/signup', url: '/signup', templateUrl: '/app/js/views/signup-form.html', controller: 'SignupCtrl' },
                              { name: '/logout', url: '/logout', controller: 'LogoutCtrl' },

                              { name: '/:categoryId', url: '/:categoryId', templateUrl: '/app/partials/phone-list.html', controller: 'PhoneListCtrl' }

            ];

            

            angular.forEach(states, function (state) {
                $stateProvider.state(state.name, state);
            });

             /*
                $stateProvider
                  // HOME STATES AND NESTED VIEWS ========================================
                  .state('/', {
                      url: '/',
                      templateUrl: '/partials/home.html'
                  })
                  .state('/phones/:phoneId', {
                      url: '/phones/:phoneId',
                      templateUrl: '/partials/phone-detail.html',
                      controller:'PhoneDetailCtrl'
                  })
                                  
                  .state('/about', {
                      url: '/about',
                      templateUrl: '/partials/about.html'
                  })
                  
                  .state('/cart', {
                      url: '/cart',
                      templateUrl: '/partials/cart.html',
                      controller: 'CartCtrl'
                  })

                  .state('/upload', {
                      url: '/upload',
                      templateUrl: '/upload.html'
                       set state only if user is authenticated 
                      resolve: {
                        user: 'User',
                        authenticationRequired: function(user) {
                          user.isAuthenticated();
                        }
                      }
                  });
                */
        }

  );

phonecatApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('phonecatApp')
      //.setStorageType('sessionStorage') //default:localStorage
      .setNotify(true, true)
});

phonecatApp.run(function ($rootScope, $state, User) {
    try  {
        User.isAuthenticated();
    } catch(e) {
        // do nothing with this error
    }

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        //console.log('$stateChangeSuccess', event, toState, toParams, fromState, fromParams);
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

        
        if (error.name === 'AuthenticationRequired') {

            //console.log('$stateChangeError', event, toState, toParams, fromState, fromParams);

            try {
                var refreshTokenSuccess = function () { $state.go(toState.name) };
                User.refreshToken(refreshTokenSuccess);
                //User.refreshToken().then($state.go(toState.name, {}, { reload: true }));
            } catch (e) {
                //console.log(e);
                User.setNextState(toState.name, 'You must login to access this page');
                $state.go('/login', {}, { reload: true });
            }
        }
    });
});


function flowConfig(flowFactoryProvider) {

      flowFactoryProvider.defaults = {
          target: 'http://cdn.onyximports.com.br/api/upload',//'api/upload',
          permanentErrors: [404, 500, 501],
          maxChunkRetries: 1,
          chunkRetryInterval: 5000,
          simultaneousUploads: 4
      };

      flowFactoryProvider.on('catchAll', function (event) {
          //console.log('catchAll', arguments);
      });
      // Can be used with different implementations of Flow.js
      // flowFactoryProvider.factory = fustyFlowFactory;
}


//twinMax animations 
var SwitchForm = function (degrees) {
    if (degrees == null) { degrees = 0; }
    TweenMax.to('#login-form', 1, { 'rotationY': degrees, transformPerspective: 600, onComplete: function () {  } });
}



 
