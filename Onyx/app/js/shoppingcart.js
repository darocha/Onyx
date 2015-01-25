var ShoppingCart = angular.module('shoppingCart', []);
  
ShoppingCart.factory('Item', function() {
  function Item() {
    this.total = function() {
      return (this.qty * this.prize) || 0;
    }
  }
  
  return Item;
});

ShoppingCart.controller('CartCtrl', function($scope, Item) {
  $scope.cartItems = [new Item(), new Item(), new Item(), new Item()];
  
  $scope.$watch('cartItems', function() {
    var cartTotal = 0;
    
    $scope.cartItems.forEach(function(item) {
      cartTotal += item.total();
    });
    
    $scope.cartTotal = cartTotal;
  }, true);
});