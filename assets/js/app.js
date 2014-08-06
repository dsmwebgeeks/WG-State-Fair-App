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
	$scope.filterBy = [];

	$scope.loadList = function() {
		$http.get("/vendor", {
			timeout: 1000
		}).success(function(data) {

			$scope.vendors = data;
			localStorage.setItem("vendorList", JSON.stringify(data));
			$scope.sortVendors();

		}).error(function() {

			$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));
			$scope.sortVendors();
			alert("List loaded offline, and may not be very current");
		});
	};


	$scope.sortVendors = function() {
		navigator.geolocation.getCurrentPosition(gotGPS, errorGPS);

		function errorGPS(err) {
			$scope.sortingDistances = false;

			switch (err.code) {
				case 1:
					alert("Can't sort position");
					break;
				case 2:
					alert("Your position is unavailable");
					break;
				case 3:
					alert("Timed out getting your position");
					break;
			}
		}

		function gotGPS(position) {
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
		}
	};


	$scope.loadList();


	$scope.applyFilters = function(filter) {
		var filterCount = 0;
		var newList = [];

		$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));

		function setFilterBy(i, cat) {
			var clickedButton = $("#filter-list ul li:nth-child("+(i+1)+") button");
			if ($scope.filterBy[i]) {
				$scope.filterBy[i] = null;
				clickedButton.removeAttr("class");
				clickedButton.addClass("btn btn-default");
			} else {
				$scope.filterBy[i] = cat;
				clickedButton.removeAttr("class");
				clickedButton.addClass("btn btn-info fa fa-check");
			}
		}
		
		if (filter === "beer") {
			setFilterBy(0, "beer");
		} else if (filter === "otherAlcohol") {
			setFilterBy(1, "otherAlcohol");
		} else if (filter === "oldFashioned") {
			setFilterBy(2, "oldFashioned");
		} else if (filter === "coke") {
			setFilterBy(3, "coke");
		} else if (filter === "pepsi") {
			setFilterBy(4, "pepsi");
		}
		
		if ($scope.filterBy.length !== 0) {
			for (var j = 0; j < $scope.filterBy.length; j++) {
				for (var i = 0; i < $scope.vendors.length; i++) {
					if ($scope.filterBy[j] && $scope.vendors[i].categories[$scope.filterBy[j]] && !$scope.vendors[i].inList) {
						$scope.vendors[i].inList = true;
						// saying in list to prevent duplicates in filter list
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
		}).error(function() {
			for (var i = 0; i < $scope.vendors.length; i++) {
 				if ($scope.vendors[i].id == $scope.itemId) {
 					$scope.vendor = $scope.vendors[i];
 				}
 			}

			$scope.loadMap();
			setFilterState();
			alert("Page loaded offline; vender categories may not be up to date");
		});
	};


	$scope.getComments = function() {
		$http.get("/vendor/"+$scope.itemId+"/comments")
		.success(function(data) {
			$scope.comments = data.reverse();
		}).error(function(err) {
			alert("Error getting comments");
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
		var cats = $scope.vendor.categories;
		var i = 1;
		
		for (cat in cats) {
			if (typeof cats[cat] !== "boolean") { continue; }
			var toggle = $(".edit-category ul li:nth-child("+i+") button");

			if ($scope.vendor.categories[cat] === true) {
				toggle.removeClass("inactive");
			} else {
				toggle.addClass("inactive");
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
			if (data.error) {
				alert(data.error);
			}
		}).error(function(err) {
			alert("Error sending update");
			console.log(err);
		});
	}

	$scope.toggleCategory = function(item) {
		var categories = $scope.vendor.categories;
		
		if ($scope.userIsLoggedIn) {
			for (cat in categories) {
				if (cat === item && categories[cat] === true) {
					categories[cat] = false;

					sendUpdate(cat, categories[cat]);

				} else if (cat === item && categories[cat] === false) {
					categories[cat] = true;

					sendUpdate(cat, categories[cat]);
				}
			}
			setFilterState();
		} else {
			setFilterState();
		}
	};


	$scope.addComment = function() {
		//$(".comments .list-group").prepend('<div class="list-group-item"><h4 class="list-group-item-heading">@'+$scope.username+'</h4><p class="list-group-item-text">'+$scope.comment+'</p></div>');

		$http.post("/vendor/addcomment", {
			vendor: $scope.itemId,
			comment: $scope.comment
		})
		.success(function(data) {
			$scope.getComments();
		}).error(function(err) {
			alert("Error adding comment");
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

loadCSS('/css/ubuntu.css');
loadCSS('/css/font-awesome.min.css');
