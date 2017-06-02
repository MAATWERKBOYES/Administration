define(['jquery', 'bootstrap', 'util/connection', 'util/user'], function ($, bootstrap, connection, user) {
    $.ajax({
        url: 'include/navbar.html',
        cache: false,

        success: function (data) {
            $(document).ready(function () {
                $('body').prepend(data);

                if (user.isLoggedIn()) {
                    $('#navlogin').attr('href', '#').text('Logout').attr('id', 'navlogout');
                    $('#navloginright').prepend('<li><a>Logged in as:' + 'LOL' + '</a></li>');
                    $('body').on('click', '#navlogout', function () {
                        user.logout();
                    });
                }

                var path = window.location.pathname.replace(/^.*[\\\/]/, '');
                $('#navbar > ul').children().each(function () {
                    var element = $(this).find('a');
                    if (element.attr('href') === path) {
                        $(this).addClass('active');
                        return true;
                    }
                });
            });
        }
    });
});
