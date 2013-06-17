var LoginCtrl = ['$rootScope', '$scope', '$location', 'client', 'identity',
    function ($rootScope, $scope, $location, client, identity) {
        $scope.identity = identity;
        $scope.login = function () {

            client.login("facebook").then(function (success) {

                identity.isLoggedIn = true;
                identity.userId = client.currentUser.userId;
                if ($rootScope.returnPath) {
                    $location.path($rootScope.returnPath);
                } else {
                    $location.path('/');
                }
                $scope.$apply();
            }, function (error) {
                alert(error);
            });
        };
    }];
