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


