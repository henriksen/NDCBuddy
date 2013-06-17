var EventListCtrl = ['$scope', '$location', 'client',
    function ($scope, $location, client) {
        $scope.register = function (eventId) {
            var registeredTable = client.getTable("registeredForEvent");
            registeredTable.insert({ eventId: eventId }).then(function (success) {
                $location.path("/event/" + eventId);
                $scope.$apply();
            });
        };

        var eventsTable = client.getTable('events');
        eventsTable.read().then(function (eventItems) {
            $scope.eventItems = eventItems;
            $scope.$apply();
        });
    }];
