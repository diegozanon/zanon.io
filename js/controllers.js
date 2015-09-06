var ctrls = angular.module('zanonControllers', []);

ctrls.controller('MainController', function($scope) {

	$scope.active = {
		all: true,
		angular: false,
		node: false,
		mongodb: false,
		aws: false,
		android: false,
		ios: false
	};

	$scope.filter = function(filter) {
		for (var key in $scope.active) {
			$scope.active[key] = false;
		}

		$scope.active[filter] = true;
	};

	// Just for fun:
	console.meme("What are you looking for?", "That's my meme spot", "Not Sure Fry", 400, 300); // reload the site with Chrome's DevTools open
});

ctrls.controller('404Controller', function() {
	initInvaders404();
});

// Empty controllers
ctrls.controller('PostsController', function() {});