'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('MainCtrl', function($scope,  $stateParams, $location, User) {
     
     $scope.Title = "Home";

     $scope.user = User.getUserData();
     
     $scope.SetTitle = function(title) {

       $scope.Title = title;

     };

     

 });

phonecatControllers.controller('NavigationCtrl', function($scope, $element) {

     var categories = [{ 
                              title: 'Computers',
                              url:'/computers',
                              categories: [
                                {
                                  title: 'Laptops',
                                  url:'/computers/laptops',
                                  categories: [
                                    {
                                      title: 'Ultrabooks',
                                      url:'/computers/laptops/ultrabooks'
                                    },
                                    {
                                      title: 'Macbooks',
                                      url:'/computers/laptops/macbooks'           
                                    }
                                  ]
                                },

                                {
                                  title: 'Desktops',
                                  url:'/computers/desktops'
                                },

                                {
                                  title: 'Tablets',
                                  url:'/computers/tablets',
                                  categories: [
                                    { 
                                      title: 'Apple',
                                      url:'/computers/tablets/apple'
                                    },
                                    {
                                      title: 'Android',
                                      url:'/computers/tablets/android'
                                    }
                                  ]        
                                }
                              ]
                            },

                            {
                              title: 'Printers',
                              url:'/printers'
                            },
                            {
                              title: 'Phones',
                              url:'/phones'
                            }

                          ];


      $scope.categories = [

                        { title :'Home', url:'/' },
                        { title :'Categories', url:'/categories', categories:categories },
                        { title :'Cart', url:'/cart' },
                        { title :'About us', url:'/about', categories:

                            [ { title :'History', url:'/about/history'},
                              { title :'The Team', url:'/about/team', categories:[{ title :'Management', url:'/about/team/management'},{ title :'Sales', url:'/about/team/sales' },{ title :'Development', url:'/about/team/development' }]},
                              { title :'Our Address', url:'/about/address'}
                            ]

                        },
                        { title :'Contact us', url:'/contact'},
                        { title: 'Upload', url: '/upload' },
                        { title: 'Logout', url: '/logout' }


                     ];                          

      


});



phonecatControllers.controller('CartCtrl', function($scope, $http, ngCart) {

    ngCart.setTaxRate(7.5);
    ngCart.setShipping(2.99);
    console.log (ngCart);

    $scope.SetTitle('Cart');
        
    $scope.checkout = function() {
           $scope.summary = ngCart.toObject();
           
         // Post your cart to your resource
         //$http.post('cart/', ngCart.toObject());
    }
  
});

phonecatControllers.controller('ContactCtrl', function($scope, $stateParams, $location) {
     

});

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$stateParams' , 'Phone',
  function($scope, $stateParams, Phone) {
    $scope.phone = Phone.get({phoneId: $stateParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
      $scope.SetTitle(phone.name);  
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);

phonecatControllers.controller('CategoryDetailCtrl', ['$scope', '$stateParams', 'Phone',
  function ($scope, $stateParams, Phone) {
      $scope.phone = Phone.get({ phoneId: $stateParams.phoneId }, function (phone) {
          $scope.mainImageUrl = phone.images[0];
          $scope.SetTitle(phone.name);
      });

      $scope.setImage = function (imageUrl) {
          $scope.mainImageUrl = imageUrl;
      }
  }]);
