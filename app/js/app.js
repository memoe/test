'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', []);

// controllers ===============================================

myApp.controller('ListCtrl', ['$scope', '$http', 'myDataService', function($scope, $http, myDataService) {

	
	$http.get('/api/reviews')
		.success(function(data, status, headers, config) {

			console.log("Data received");
			console.log(data);

			$scope.books = data;

			console.log("Books:")
			console.log($scope.books);
		})
		.error(function(data, status, headers, config) {
			console.error("No data received");
			return data;
		});

	
	$scope.genres = genres;
	$scope.newReview = {};
	$scope.newReview.genres = [];
	$scope.showForm = false;
	$scope.lastDelete = false;

	// add review to database
	$scope.addReview = function() {
		console.log("Add review...");


		$http.post('/api/reviews', $scope.newReview)
			.success(function(data, status, headers, config) {

				$scope.books = data;

				// clear forms
				$scope.newReview = {};
				$scope.newReview.genres = [];
				$scope.showForm = false;

				console.log("Success");
			})
			.error(function(data, status, headers, config) {
				console.log("Error received");
			})

		
	}

	$scope.undoRemove = function() {
		$scope.newReview = $scope.lastRemove;
		$scope.addReview();

	};

	// add label to newReview
	$scope.selectLabel = function(genre) {
		console.log("selectLabel clicked: " + genre);

		var entryAvailable = false,
			entryPosition;

		// check for existing entry
		for (var i = 0; i < $scope.newReview.genres.length; i++) {
			if ($scope.newReview.genres[i] == genre) {
				entryAvailable = true;
				entryPosition = i;
				console.log("match: " + entryPosition);
			};
		}

		// add entry if not available
		if (entryAvailable) {
			$scope.newReview.genres.splice(entryPosition,1);
			entryAvailable = false;
		} else {
			$scope.newReview.genres.push(genre);
		};
		
		console.log($scope.newReview.genres);
	}

	// remove reviews
	$scope.removeReview = function(id) {

		for (var i = 0; i < $scope.books.length; i++) {
			if ($scope.books[i]._id == id) {
				$scope.lastRemove = $scope.books[i];
				//console.log($scope.lastRemove);		
			};
		}

		 

		$http.delete('/api/reviews/' + id)
			.success(function(data, status, headers, config) {
				console.log("entry deleted " + id);
				$scope.lastDelete = true;


				$http.get('/api/reviews')
					.success(function(data, status, headers, config) {
						console.log("Data received");
						console.log(data);

						$scope.books = data;

						console.log("Books: " + $scope.books);
						//console.log("book " + this.books);

					})
					.error(function(data, status, headers, config) {
						console.error("No data received");
						return data;
					});


			})
			.error(function(data, status, headers, config) {

			});

	}
	
}]);




// filter ======================================================

myApp.filter('reverse', function() {
  return function(items) {
  	if (items) {
  		return items.slice().reverse();	
  	};
    
  };
});


// service ======================================================

myApp.factory('myDataService', ['$http', function($http){
	// enter service here
	

}]);



// data sources =================================================

var genres = [ 'fable', 'fantasy', 'fiction', 'folklore', 'horror', 'humor', 'legend', 'metafiction', 'mystery', 'mythology', 'non-fiction', 'poetry' ];

