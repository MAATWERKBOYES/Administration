define(['jquery', 'util/user'], function ($, user) {
    user.processLogin();

    $(document).on('click', '#btnLogin', function () {
        user.redirectToFontysLogin();
    });
});
