var EventCtrl = ['$scope', '$routeParams', '$http', '$timeout', 'client', function ($scope, $routeParams, $http, $timeout, client) { /* constructor body */
    $scope.status = "";
    $scope.eventId = $routeParams.eventId;
    $scope.isPosting = false;
    $scope.canPost = function () {
        return !($scope.status.length > 0) && !$scope.isPosting;
    };

    var refreshStatuses = function () {
        client.getTable("status")
            .where({ eventId: $scope.eventId })
            .read().done(
            function (result) {
                var statuses = _.map(result, function (item) {
                    var username = item.userId.split(':')[1];
                    return {
                        id: item.id,
                        date: jQuery.timeago(new Date(Number(item.date)).toISOString()),
                        status: item.status,
                        userId: item.userId,
                        fullName: item.fullName,
                        profileImg: "https://graph.facebook.com/" + username + "/picture?width=75&height=75"
                    };
                });
                $scope.statuses = statuses;
                $scope.$apply();
            }
        );
    };

    var refreshTimer = function () {
        refreshStatuses();
        $timeout(refreshTimer, 5000);
    };

    $scope.formatDate = function (utcDate) {
        return new Date(utcDate).toLocaleString();
    };

    $scope.post = function () {
        if ($scope.status && $scope.status.length > 0) {
            $scope.isPosting = true;
            client.getTable('status').insert({ eventId: $scope.eventId, status: $scope.status }).then(
                function (success) {

                    refreshStatuses();
                    $scope.isPosting = false;


                });
            $scope.status = "";
        }
    };


    client.getTable('events').where({ id: $scope.eventId }).read().done(
        function (result) {
            $scope.event = _.first(result);
            $scope.$apply();
        });
    refreshTimer();
}];