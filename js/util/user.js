define(['jquery', 'oidc', 'util/connection', 'noty'], function ($, oidc, connection, noty) {
    const USER_STORAGE_NAME = 'user';
    const settings = {
        authority: 'https://identity.fhict.nl/connect/authorize',

        client_id: 'i341553-smartmobil',
        redirect_uri: 'https://i341553.iris.fhict.nl/docentgo/login.html',
        response_type: 'token',
        scope: 'fhict fhict_personal',

        filterProtocolClaims: true,

        loadUserInfo: false,
        metadata: {
            issuer: 'https://identity.fhict.nl/',
            jwks_uri: 'https://identity.fhict.nl/.well-known/jwks',
            end_session_endpoint: 'https://identity.fhict.nl/connect/endsession',
            userinfo_endpoint: 'https://identity.fhict.nl/connect/userinfo',
            authorization_endpoint: 'https://identity.fhict.nl/connect/authorize'
        }
    };
    const manager = new Oidc.UserManager(settings);
    const user = {};

    user.processLogin = function () {
        if (/access_token/.test(window.location.href)) {
            manager.signinRedirectCallback()
                .then(login)
                .catch(function (error) {
                    console.log(error);

                    printException('Failed to process login request, please try again.')
                });
        }
    };

    user.checkLoggedIn = function () {
        if (!this.isLoggedIn()) {
            noty({
                text: 'You\'re not logged in, click here to login.',
                theme: 'relax',
                layout: 'topCenter',
                type: 'warning',
                force: true,
                timeout: false,
                callback: {
                    onClose: function () {
                        window.location.replace('login.html');
                    }
                }
            });
        }
    };

    user.logout = function () {
        localStorage.removeItem(USER_STORAGE_NAME);
        manager.signoutRedirect().catch(function (error) {
            console.log(error);

            printException('Failed to logout of Fontys, please try manually logging out of Fontys\' API.');
        });
    };

    user.redirectToFontysLogin = function () {
        manager.signinRedirect().catch(function (error) {
            console.log(error);

            printException('Failed to login to Fontys\' API, please try again or constract an administrator.');
        });
    };

    user.isLoggedIn = function () {
        return localStorage.getItem(USER_STORAGE_NAME) !== null;
    };

    user.getUserObject = function () {
        return JSON.parse(localStorage.getItem(USER_STORAGE_NAME));
    };

    function login(userObject) {
        const token = userObject.access_token;
        connection.loginToApi(token).done(function () {
            localStorage.setItem(USER_STORAGE_NAME, JSON.stringify(userObject));
            window.location.replace('index.html');
        }).fail(function (xhr, status, error) {
            printException('Failed to contact the DocentGO API, did you enable insecure content?');
        });
    }

    function printException(message) {
        noty({
            text: message,
            theme: 'relax',
            layout: 'topCenter',
            type: 'error',
            force: true,
            timeout: 5000
        });
    }

    return user;
});
