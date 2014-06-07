var main = (function($) {
    // custom code goes here

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
    }

    var loadVendors = function () {
        $('.sub-nav h2 span').show().addClass('glyphicon-time');
        $.get('/vendor', showVendors);
    }

    var showReloadLink = function () {
        $('a[href=#reload]').removeClass('hide');
    }

    var enableRefresh = function () {
        $('a[href=#reload]').click(function(e) {
            e.preventDefault();
            loadVendors();
        })
    }


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
    }


    var init = function () {
        console.log('ready');
        loadVendors();
        showReloadLink();
        enableRefresh();
    }

    return {
        init: init,
        loadVendors: loadVendors,
        deleteAllVendors: deleteAllVendors
    }   
}($));

$(document).ready(main.init);