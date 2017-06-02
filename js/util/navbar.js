define(['jquery', 'bootstrap', 'util/connection', 'util/user'], function ($, bootstrap, connection, user) {
    $.ajax({
        url: 'include/navbar.html',
        cache: false,

        success: function (data) {
            $(document).ready(function () {
                $('body').prepend(data);

                if (user.isLoggedIn()) {
                    processLoggedInItems();
                } else {
                    processLoggedOutItems();
                }

                setCurrentActiveTab();
            });
        }
    });

    function setCurrentActiveTab() {
        const path = window.location.pathname.replace(/^.*[\\\/]/, '');
        $('#navbar').find('> ul').children().each(function () {
            const element = $(this).find('a');
            if (element.attr('href') === path) {
                $(this).addClass('active');
                return true;
            }
        });
    }

    function processLoggedInItems() {
        $('#navHome').attr('href', 'index.html');
        $('#navRightLogin').attr('href', '#').text('Logout').attr('id', 'navRightLogout');
        $('body').on('click', '#navRightLogout', function () {
            user.logout();
        });

        const leftItems = [
            {name: 'Home', url: 'index.html'},
            {name: 'Teachers', url: 'teachers.html'},
            {name: 'Questions', url: 'questions.html'}
        ];
        processItems('#navLeft', leftItems);
    }

    function processLoggedOutItems() {
        $('#navHome').attr('href', 'login.html');
    }

    function processItems(id, items) {
        items.forEach(function (item, i) {
            $(id).append('<li><a href="' + item.url + '">' + item.name + '</a></li>')
        });
    }
});
