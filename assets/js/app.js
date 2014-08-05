var app = angular.module("fairDrinks", ["ngRoute"]);
var currentLocation;

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "/views/vendors.html",
		controller: "VendorsController"
	})
	.when("/vendor/:id", {
		templateUrl: "/views/vendor.html",
		controller: "VendorController"
	})
	.when("/vendor/:id/edit", {
		templateUrl: "/views/vendor-edit.html",
		controller: "EditVendorController"
	});
});



app.controller("VendorsController", function($scope, $http, $location) {
	// Set our state of sorting vendors to true by default
	$scope.sortingDistances = true;

	$scope.loadList = function() {
		$http.get("/vendor", {
			timeout: 1000
		}).success(function(data) {

			$scope.vendors = data;
			localStorage.setItem("vendorList", JSON.stringify(data));
			$scope.sortVendors();

			console.log("Online");

		}).error(function() {

			$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));
			$scope.sortVendors();

			console.log("Offline");
		});
	};


	$scope.sortVendors = function() {
		// Should moernizr throw an error if no GPS?
		// Should high accuracy be enabled?
		// What about refreshing list?
		navigator.geolocation.getCurrentPosition(gotGPS, errorGPS);

		function errorGPS(err) {
			$scope.sortingDistances = false;

			switch (err.code) {
				case 1:
					console.log("User denied permission");
					break;
				case 2:
					console.log("Position unavailable");
					break;
				case 3:
					console.log("Timed out getting position");
					break;
			}
		}

		function gotGPS(position) {
			console.log("Got GPS");
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;

			// Set global variable
			currentLocation = {
				lat: lat,
				lng: lng
			};

			// currentLocation = {
			// 	lat: 41.59566,
			// 	lng: -93.55255
			// };

			sortDistances(lat, lng);
			// sortDistances(41.59566, -93.55255);
		}

		function sortDistances(lat, lng) {
			for (var i = 0; i < $scope.vendors.length; i++) {
				var vendor = $scope.vendors[i];
				var vendorPos = [vendor.lat, vendor.lng];
				var userPos = [lat, lng];
				var distance = [];

				distance[0] = userPos[0] - vendorPos[0];
				distance[1] = userPos[1] - vendorPos[1];
				distance[3] = (distance[0] * distance[0]) + (distance[1] * distance[1]);
				distance[3] = Math.sqrt(distance[3]);

				vendor.distance = distance[3];
			}

			$scope.sortingDistances = false;

			$scope.$apply();
			console.log($scope.vendors[4]);
			console.log("Finished getting distances");
		}
	};


	$scope.loadList();


	$scope.applyFilters = function(filter) {
		var filterCount = 0;
		var newList = [];
		var filterRegex = [];

		$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));

		if (filter === "beer") {
			filterRegex[0] = /turkey/ig;
		}
		if (filter === "otherAlcohol") {
			filterRegex[1] = /beef/ig;
		}
		if (filter === "oldFashioned") {
			filterRegex[2] = /campbell's/ig;
		}

		if (filterRegex.length !== 0) {

			for (var j = 0; j < filterRegex.length; j++) {
				for (var i = 0; i < $scope.vendors.length; i++) {

					if (filterRegex[j] && filterRegex[j].test($scope.vendors[i].name)) {
						newList[filterCount] = $scope.vendors[i];
						filterCount = filterCount + 1;
					}

				}
			}

			$scope.vendors = newList;
		}

		$scope.sortVendors();
	};

});


app.controller("VendorController", function($scope, $http, $routeParams) {
	$scope.itemId = $routeParams.id;
	$scope.userIsLoggedIn = false;


	$scope.loadVendor = function() {
		$http.get("/vendor/"+$scope.itemId, {
			timeout: 1000
		}).success(function(data) {

			$scope.vendor = data;
			$scope.loadMap();
			
			setFilterState();

			console.log("Online");

		}).error(function() {

			//$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));
			//$scope.vendor = $scope.vendors[$scope.itemId];	

			for (var i = 0; i < $scope.vendors.length; i++) {
 				if ($scope.vendors[i].id == $scope.itemId) {
 					$scope.vendor = $scope.vendors[i];
 				}
 			}

			$scope.loadMap();

			setFilterState();

			console.log("Offline");
		});

	};


	$scope.getComments = function() {
		$http.get("/vendor/"+$scope.itemId+"/comments")
		.success(function(data) {
			$scope.comments = data.reverse();
		}).error(function(err) {
			console.log(err);
		});
	};


	$scope.checkIfLoggedIn = function() {
		$http.get("/isLoggedIn").success(function(data) {
			$scope.userIsLoggedIn = true;
			$scope.username = data.username;
		}).error(function() {
			$scope.userIsLoggedIn = false;
		});
	};


	$scope.checkIfLoggedIn();
	$scope.loadVendor();
	$scope.getComments();




	function setFilterState() {
		var i = 1;
		console.log($scope.vendor);
		
		for (cat in $scope.vendor.categories) {
			var toggle = $(".edit-category ul li:nth-child("+i+") button");

			if ($scope.vendor.categories[cat]) {
				toggle.removeAttr("disabled");
			} else {
				toggle.attr("disabled", "disabled");
			}
			i = i+1;
		}

	}

	function sendUpdate(category, value) {
		var toUpdate = {
			"vendorId": $scope.itemId,
			"category": category,
			"value": value
		};
		
		$http.post("/vendor/update", toUpdate)
		.success(function(data) {
			console.log(data);
		}).error(function(err) {
			console.log(err);
		});
	}

	$scope.toggleCategory = function(item) {
		var categories = $scope.vendor.categories;

		for (cat in categories) {
			if (cat === item && categories[cat]) {
				categories[cat] = false;

				sendUpdate(cat, categories[cat]);

			} else if (cat === item && categories[cat] === false) {
				categories[cat] = true;

				sendUpdate(cat, categories[cat]);
			}
		}
		setFilterState();
	};


	$scope.addComment = function() {
		//$(".comments .list-group").prepend('<div class="list-group-item"><h4 class="list-group-item-heading">@'+$scope.username+'</h4><p class="list-group-item-text">'+$scope.comment+'</p></div>');

		$http.post("/vendor/addcomment", {
			vendor: $scope.itemId,
			comment: $scope.comment
		})
		.success(function(data) {
			console.log(data);
			$scope.getComments();
		}).error(function(err) {
			console.log(err);
		});
	};


	$scope.loadMap = function() {

		// If Leaflet hasn't loaded, wait for it
		if ( typeof(L) !== 'undefined' ) {
			var map = L.map('leafletMap').setView([$scope.vendor.lat, $scope.vendor.lng], 18);
			var vendorMarker = L.marker([$scope.vendor.lat, $scope.vendor.lng]).addTo(map);

			var userIcon = L.divIcon({className: 'fa fa-2x custom-marker fa-user'});
			var userMarker = L.marker([currentLocation.lat, currentLocation.lng], { icon: userIcon }).addTo(map);

			map.fitBounds([
			    [$scope.vendor.lat, $scope.vendor.lng],
			    [currentLocation.lat, currentLocation.lng]
			], {
				maxZoom: 19
			});

			// Tile provider will need to be changed for production
			L.tileLayer("http://a.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "Map Attribution",
				maxZoom: 19
			}).addTo(map);
		} else {
			// Keep trying every second
			setTimeout($scope.loadMap, 1000);
		}
	};

});


// Load CSS asychronously for slower connections (so users will still see content)
function loadCSS(e,t,n){"use strict";var i=window.document.createElement("link");var o=t||window.document.getElementsByTagName("script")[0];i.rel="stylesheet";i.href=e;i.media="only x";o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||"all"})}

loadCSS('http://fonts.googleapis.com/css?family=Ubuntu');
loadCSS('/css/font-awesome.min.css');
