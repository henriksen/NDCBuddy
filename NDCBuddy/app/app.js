

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
			//when('/phones/:phoneId', { templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl }).
			otherwise({ redirectTo: '/events' });
  }])
.run(['$rootScope', '$location', 'identity', function ($rootScope, $location, identity) {

	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		$rootScope.error = null;
		if (next.isRestricted && !identity.isLoggedIn) {
			$location.path('/login');
		}
	});
}]);


function LoginCtrl($scope, $location, client, identity) {
	$scope.identity = identity;
	
	client.login("facebook").then(function (success) {
		
		identity.isLoggedIn = true;
		identity.userId = client.currentUser.userId;
		$location.path("/events");
		$scope.$apply();
	}, function (error) {
		alert(error);
	});

}


function EventListCtrl($scope, client, identity) {
	$scope.register = function (eventId) {
		var registeredTable = client.getTable("registeredForEvent");
		registeredTable.insert({ eventId: eventId }).then(function(success) {
			alert("Registered for event!");
		});
		$scope.selectedId = eventId;
	};

	var eventsTable = client.getTable('events');
	eventsTable.read().then(function (eventItems) {
		$scope.eventItems = eventItems;
		$scope.$apply();
	});
} 