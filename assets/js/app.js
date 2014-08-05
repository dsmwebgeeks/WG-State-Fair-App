var app = angular.module("fairDrinks", ["ngRoute"]);

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
	$scope.loadList = function() {
		startReloadSpin();

		$http.get("/vendor", {
			timeout: 1000
		}).success(function(data) {

			$scope.vendors = data;
			localStorage.setItem("vendorList", JSON.stringify(data));
			startLoadingIcon();
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
			
			//sortDistances(lat, lng);
			sortDistances(41.59566, -93.55255);
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

			$scope.$apply();
			console.log($scope.vendors[4]);
			console.log("Finished getting distances");
		}
	};


	$scope.loadList();


	$scope.applyFilters = function() {
		var filterCount = 0;
		var newList = [];
		var filterRegex = [];

		$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));

		if ($scope.filters.hasTurkey) {
			filterRegex[0] = /turkey/ig;
		}
		if($scope.filters.hasBeef) {
			filterRegex[1] = /beef/ig;
		}
		if($scope.filters.campbells) {
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

			console.log("Online");

		}).error(function() {

			//$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));
			//$scope.vendor = $scope.vendors[$scope.itemId];	

			

			$scope.loadMap();

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


	setFilterState();


	function setFilterState() {
		var i = 1;
		for (cat in $scope.categories) {
			var toggle = $(".edit-category ul li:nth-child("+i+")");

			if ($scope.categories[cat]) {
				toggle.attr("class", "active");
			} else {
				toggle.attr("class", "disabled");
			}
			i = i+1;
		}
	}


	$scope.toggleCategory = function(item) {
		var categories = $scope.vendor.categories;

		for (cat in categories) {
			if (cat === item && categories[cat]) {
				categories[cat] = false;
			} else if (cat === item && categories[cat] === false) {
				categories[cat] = true;
			}
		}
		setFilterState();
		console.log(categories);
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
		var map = L.map('leafletMap').setView([$scope.vendor.lat, $scope.vendor.lng], 18);
		var vendorMarker = L.marker([$scope.vendor.lat, $scope.vendor.lng]).addTo(map);

		// Tile provider will need to be changed for production
		L.tileLayer("http://a.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "Map Attribution",
			maxZoom: 19
		}).addTo(map);
	};

});


app.controller("EditVendorController", function($scope, $http, $routeParams, $location) {
	var itemId = $routeParams.id;

	$scope.loadVendor = function() {
		$http.get("/vendor/"+itemId, {
			timeout: 1000
		}).success(function(data) {
			$scope.vendor = data;
			console.log(data);

			console.log("Online");
		}).error(function() {
			$scope.vendors = JSON.parse(localStorage.getItem("vendorList"));

			for (var i = 0; i < $scope.vendors.length; i++) {
				if ($scope.vendors[i].id == itemId) {
					$scope.vendor = $scope.vendors[i];
				}
			}

			console.log("Offline");
		});
	};

	$scope.updateVendor = function() {
		console.log("Update");

		var name = $scope.vendor.name;
		var landmark = $scope.vendor.landmark;
		var lat = $scope.vendor.lat;
		var lng = $scope.vendor.ng;

		$http.put("/vendor/"+itemId, {
			name: name,
			landmark: landmark,
			lat: lat,
			lng: lng
		}).success(function(data) {
			console.log(data);
			$location.path("/vendor/"+itemId);
		}).error(function(data) {
			console.log(data);
		});
	};

	$scope.loadVendor();
});
