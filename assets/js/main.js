var main = (function($) {
    // custom code goes here
    'use strict';

    var showVendors = function (data) {
        var $list = $('.sub-nav ul');
        $list.empty();

        if(!data.length) {
            $list.append('<li><a href="#add">Add a vendor</a></li>');
        }

        $.each(data, function(index, value) {
            $list.append('<li><a href="/vendor/' + value.id + '">' + value.name + '</a></li>');
        });

        $('.sub-nav h2 span').fadeOut(1000);
    };

    var loadVendors = function () {
        $('.sub-nav h2 span').show().addClass('glyphicon-time');
        $.get('/vendor', showVendors);
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
    };

    return {
        init: init,
        loadVendors: loadVendors,
        deleteAllVendors: deleteAllVendors
    };
}($));

$(document).ready(main.init);
