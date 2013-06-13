

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
}