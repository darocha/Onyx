app.controller('AdminSupplierCreateController', ['$scope', '$state', 'Supplier',
    function ($scope, $state, Supplier) {
        $scope.h1 = "Register a new Supplier";

        $scope.store = function () {
            Supplier.post($scope.supplier)
                .then(
                    function () {
                        console.log("Successfully Created Supplier");

                        // Force Reload on changing state
                        $state.go('admin.supplier', {}, { reload: true });
                    },
                    function (response) {
                        console.log("Error with status code: ", response.status);
                    }
                );
        };
    }]);

/*
$stateProvider
    ...
    .state('admin.supplier', {
        url : "/supplier",
        templateUrl : 'templates/admin/supplier/index.html',
        controller: "AdminSupplierIndexController",
        resolve: {
            suppliers: ['Supplier', function(Supplier) {
                return Supplier.getList();
            }]
        }
    })
    .state('admin.supplier.create', {
        url : "/create",
        templateUrl : 'templates/admin/supplier/create.html',
        controller: "AdminSupplierCreateController"
    })

*/