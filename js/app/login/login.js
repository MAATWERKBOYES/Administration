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
manager.events.addUserLoaded(function (user) {
    const data = {
        token: user.access_token
    };

    localStorage.set('user', user);
    $.post(LOGIN_URL, data);
});

manager.events.addUserUnloaded(function (user) {
    localStorage.set('user', null);
});

$(document).ready(function () {
    processLoginRequest();
});

$(document).on('click', '#btnLogin', function () {
    manager.signinRedirect();
});

function processLoginRequest() {
    if (!isLoggedIn) {
        manager.signinRedirectCallback().then(function (user) {
            if (user === null || user === undefined) {
                redirectToLogin();
            }
        }).catch(redirectToLogin);
    }
}

function getLoggedInUser() {
    return localStorage.get('user');
}

function isLoggedIn() {
    return localStorage.get('user') !== null;
}

function logout() {
    localStorage.set('user', null);
}

function redirectToLogin() {
    if (!location.pathname.endsWith("login.html")) {
        window.location = "login.html";
    }
}
