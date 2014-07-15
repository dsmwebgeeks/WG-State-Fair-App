var main = (function($) {
    // custom code goes here
    'use strict';

    var checkAgain;

    var showVendors = function (data) {
        var $list = $('.list-search-results');

        $list.empty();

        if(!data.length) {

            data = JSON.parse(localStorage.getItem("data_string"));

            console.log("I pulled from local storage");

            if( new Date().getTime() - checkAgain > 5000 ){
              console.log ("It has been more than 5 seconds since we last connected to the server");
              setTimeout( loadVendors, 1000)
           }
            //$list.append('<li><a href="#add">Add a vendor</a></li>');
        }
        else{
           localStorage.setItem("data_string", JSON.stringify(data) );
            checkAgain = new Date().getTime();
          }

         $.each(data, function(index, value) {
            $list.append('<li><a href="/vendor/' + value.id + '">' + value.name + '</a></li>');
        });

        $('.sub-nav h2 span').fadeOut(1000);
    };

    var loadVendors = function () {
        $('.sub-nav h2 span').show().addClass('glyphicon-time');
        $.get('/vendor').success(showVendors).error(function(){
            showVendors([]);
            console.log('Danger will robinson');
        });
    };

    var showReloadLink = function () {
        $('a[href=#reload]').removeClass('hide');
    };

    var enableRefresh = function () {
        $('a[href=#reload]').click(function(e) {
            e.preventDefault();
            loadVendors();
        });
    };

    var enableLoginLogout = function () {
        $.get('/isLoggedIn')
            .done(function (data){
                console.log(data);
                $("a[href='/logout']").removeClass('hide');
            }).fail(function (data) {
                console.log('error handler');
                $("a[href='/login']").removeClass('hide');
            });
    };


    var deleteAllVendors = function() {
        $.get('/vendor', function (data) {
            if(data.length) {
                $.each(data, function(index, value) {
                    $.ajax({
                        method: 'DELETE',
                        url: '/vendor/' + value.id
                    });
                });
            }
        });
    };

    var addCacheEventHandlers = function () {
      // see http://diveintohtml5.info/offline.html for info on offline mode
      // specifically see the events section.
      // It could be useful to watch for the noupdate event which signifies
      // the page was served from cache.
    };


    var init = function () {
        console.log('ready');
        loadVendors();
        showReloadLink();
        enableRefresh();
        enableLoginLogout();
    };

    return {
        init: init,
        loadVendors: loadVendors,
        deleteAllVendors: deleteAllVendors
    };
}($));

$(document).ready(function() {
    main.init();
});

var app = angular.module('fairApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/items',
        })
        .when('/vendors', {
            templateUrl: 'partials/vendors',
            controller: 'VendorsCtrl'
        })
        .when('/vendor/:id', {
            templateUrl: 'partials/vendor',
            controller: 'VendorCtrl'
        })
        .when('/vendor/edit/:id', {
            templateUrl: 'partials/vendor_edit',
            controller: 'EditVendorCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('VendorsCtrl', function($scope, $http, $location) {
    var query = $location.search().itemName;

    this.loadList = function() {
        $http.get('/vendor', {
            timeout: 1000
        }).success(function(data) {
            $scope.vendors = data;
            localStorage.setItem('vendorList', JSON.stringify(data));

            console.log('Online');

        }).error(function() {
            $scope.vendors = JSON.parse(localStorage.getItem('vendorList'));
            // Could make recursive to try again if error
            console.log('Offline');
        });
    };

    this.loadList();

    // If a query was set,
    if ( query ) {
        console.log( query );
        // TODO: Filter the list by the search query.
    }
});

app.controller('VendorCtrl', function($scope, $http, $routeParams) {
    var itemId = $routeParams.id;

    this.loadVendor = function() {
        $http.get('/vendor/' + itemId, {
            timeout: 1000
        }).success(function(data) {
            $scope.vendor = data;

            // Maybe set the vendor data in localstorage?
            console.log('Online');
        }).error(function() {
            // Offline support needed.
            console.log('Offline');
        })
    };

    this.loadVendor();
});

app.controller('EditVendorCtrl', function($scope, $http, $routeParams) {
    var itemId = $routeParams.id;

    this.loadVendor = function() {
        $http.get('/vendor/' + itemId, {
            timeout: 1000
        }).success(function(data) {
                $scope.vendor = data;

                // Maybe set the vendor data in localstorage?
                console.log('Online');
            }).error(function() {
                // Offline support needed.
                console.log('Offline');
            })
    };

    $scope.submit = function() {
       console.log("I am the submit function: vendor.landmark="+this.vendor.landmark);
    };

    console.log("Version with a submit function");
    this.loadVendor();

});
