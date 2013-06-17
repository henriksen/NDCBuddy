var RegisteredEventsCtrl = ['$scope', '$http', 'client', function ($scope, $http, client) { /* constructor body */
	var config = {};
	config.headers = {};
	config.headers["X-ZUMO-APPLICATION"] = client.applicationKey;
	config.headers["X-ZUMO-AUTH"] = client.currentUser.mobileServiceAuthenticationToken;
	$http.get('https://ndcbuddy.azure-mobile.net/api/getregisteredevents', config)
		.success(function (data, status) {
			$scope.registeredEvents = data;
		});

	$scope.post = function (event, status) {
		var statusTable = client.getTable(statuses);
		statusTable.insert({ eventId: event.eventId, status: status }).then(function (success) {

		});
	};
}];
