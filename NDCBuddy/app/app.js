angular.module('ndcbuddy.azureMobile', [], ['$provide', function ($provide) {
	$provide.factory('client', function () {
		var client = new WindowsAzure.MobileServiceClient(
			"https://ndcbuddy.azure-mobile.net/",
			"HPCnKHTBWgSiMoNxqYtjydPJSxIzFE13"
		);
		return client;
	});

	$provide.factory('identity', function (client) {
		var identity = {
			isLoggedIn: false,
			userId: ''
		};
		return identity;
	});
}]);



angular.module('ndcbuddy', ['ui.keypress', 'ndcbuddy.azureMobile']).
	config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
			when('/events', { templateUrl: '/app/partials/events.html', controller: EventListCtrl, isRestricted: true }).
			when('/login', { templateUrl: '/app/partials/login.html', controller: LoginCtrl }).
			when('/registeredEvents', { templateUrl: '/app/partials/registeredEvents.html', controller: RegisteredEventsCtrl, isRestricted: true }).
			when('/event/:eventId', { templateUrl: '/app/partials/event.html', controller: EventCtrl, isRestricted: true }).
			otherwise({ redirectTo: '/events' });
  }])
.run(['$rootScope', '$location', 'identity', function ($rootScope, $location, identity) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.isRestricted && !identity.isLoggedIn) {
            $rootScope.returnPath = $location.path();
			$location.path('/login');
		}
	});
}]);

var LoginCtrl = ['$rootScope', '$scope', '$location', 'client', 'identity',
    function ($rootScope, $scope, $location, client, identity) {
    $scope.identity = identity;
    $scope.login = function() {

        client.login("facebook").then(function(success) {

            identity.isLoggedIn = true;
            identity.userId = client.currentUser.userId;
            if ($rootScope.returnPath) {
                $location.path($rootScope.returnPath);
            } else {
                $location.path('/');
            }
            $scope.$apply();
        }, function(error) {
            alert(error);
        });
    };
}];

var EventListCtrl = ['$scope', '$location', 'client',
    function ($scope, $location, client) {
    $scope.register = function(eventId) {
        var registeredTable = client.getTable("registeredForEvent");
        registeredTable.insert({ eventId: eventId }).then(function(success) {
            $location.path("/event/" + eventId);
            $scope.$apply();
        });
    };

    var eventsTable = client.getTable('events');
    eventsTable.read().then(function(eventItems) {
        $scope.eventItems = eventItems;
        $scope.$apply();
    });
}];



var RegisteredEventsCtrl = ['$scope', '$http', 'client', function ($scope,$http, client) { /* constructor body */ 
	var config = {};
    config.headers = {};
    config.headers["X-ZUMO-APPLICATION"] = client.applicationKey;
    config.headers["X-ZUMO-AUTH"] = client.currentUser.mobileServiceAuthenticationToken;
    $http.get('https://ndcbuddy.azure-mobile.net/api/getregisteredevents', config)
		.success(function(data, status) {
			$scope.registeredEvents = data;
		});

    $scope.post = function(event, status) {
        var statusTable = client.getTable(statuses);
        statusTable.insert({ eventId: event.eventId, status: status }).then(function(success) {
            
        });
    };
}];

var EventCtrl = ['$scope', '$routeParams', '$http', '$timeout', 'client', function ($scope, $routeParams, $http, $timeout, client) { /* constructor body */ 
    $scope.status = "";
    $scope.eventId = $routeParams.eventId;
    $scope.isPosting = false;
    $scope.canPost = function() {
        return !($scope.status.length > 0) && !$scope.isPosting;
    };
    
    var refreshStatuses = function() {
        client.getTable("status")
            .where({ eventId: $scope.eventId })
            .read().done(
            function (result) {
                var statuses = _.map(result, function(item) {
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

    var refreshTimer = function() {
        refreshStatuses();
        $timeout(refreshTimer, 5000);
    };

    $scope.formatDate = function (utcDate) {
        return new Date(utcDate).toLocaleString();
    };

    $scope.post = function() {
        if ($scope.status && $scope.status.length > 0) {
            $scope.isPosting = true;
            client.getTable('status').insert({ eventId: $scope.eventId, status: $scope.status }).then(
                function(success) {
                    
                    refreshStatuses();
                    $scope.isPosting = false;
                    

                });
            $scope.status = "";
        }
    };
    

    client.getTable('events').where({ id: $scope.eventId }).read().done(
        function(result) {
            $scope.event = _.first(result);
            $scope.$apply();
        });
    refreshTimer();
}];