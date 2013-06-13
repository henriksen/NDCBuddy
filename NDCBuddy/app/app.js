

angular.module('ndcbuddy.azureMobile', [], function ($provide) {
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
});



angular.module('ndcbuddy', ['ndcbuddy.azureMobile']).
	config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
			when('/events', { templateUrl: '/app/partials/events.html', controller: EventListCtrl, isRestricted: true }).
			when('/login', { templateUrl: '/app/partials/login.html', controller: LoginCtrl }).
			when('/registeredEvents', { templateUrl: '/app/partials/registeredEvents.html', controller: RegisteredEventsCtrl, isRestricted: true }).
			when('/event/:eventId', { templateUrl: '/app/partials/event.html', controller: EventCtrl, isRestricted: true }).
			otherwise({ redirectTo: '/registeredEvents' });
  }])
.run(['$rootScope', '$location', 'identity', function ($rootScope, $location, identity) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.isRestricted && !identity.isLoggedIn) {
            $rootScope.returnPath = $location.path();
			$location.path('/login');
		}
	});
}]);


function LoginCtrl($rootScope, $scope, $location, client, identity) {
	$scope.identity = identity;
	
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

}


function EventListCtrl($scope,$location, client, identity) {
	$scope.register = function (eventId) {
		var registeredTable = client.getTable("registeredForEvent");
		registeredTable.insert({ eventId: eventId }).then(function(success) {
		    $location.path("/event/" + eventId);
		    $scope.$apply();
		});
		$scope.selectedId = eventId;
	};

	var eventsTable = client.getTable('events');
	eventsTable.read().then(function (eventItems) {
		$scope.eventItems = eventItems;
		$scope.$apply();
	});
}



function RegisteredEventsCtrl($scope, $http, client ) {
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
}

function EventCtrl($scope, $routeParams, $http, client) {
    $scope.eventId = $routeParams.eventId;
    var refreshStatuses = function() {
        client.getTable("status").where({ eventId: $scope.eventId }).read().done(
            function(result) {
                $scope.statuses = result;
                $scope.$apply();
            }
        );
    };

    $scope.formatDate = function (utcDate) {
        return new Date(utcDate).toLocaleString();
    };

    $scope.post = function() {
        if ($scope.status && $scope.status.length > 0) {
            client.getTable('status').insert({ eventId: $scope.eventId, status: $scope.status }).then(
                function(success) {
                    refreshStatuses();
                });
            $scope.status = "";
        }
    };
    

    client.getTable('events').where({ id: $scope.eventId }).read().done(
        function(result) {
            $scope.event = _.first(result);
            $scope.$apply();
        });
    refreshStatuses();
}