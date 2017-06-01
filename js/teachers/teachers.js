document.getElementById('signin').addEventListener("click", signin, false);

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
const client = new Oidc.OidcClient(settings);

$(document).ready(function () {
    loadTeachers();
});

$(document).on('change', '.present', function () {
    const element = $(this);
    const id = element.data('id');
    const present = element.prop('checked');

    updateTeacherPresentStatus(id, present);
});


function loadTeachers() {
    $.get(REQUEST_TEACHERS_URL, function (data) {
        let append = '';

        $.each(data, function (i, item) {
            if (item.personalTitle === undefined) {
                return;
            }

            append += '<tr>';
            append += '<td>' + item.id + '</td>';
            append += '<td>' + item.displayName + '</td>';
            append += '<td>' + item.personalTitle + '</td>';
            append += '<td>' + '<input type="checkbox" class="present" data-id="' + item.id + '" value="present"' + (item.present ? " checked" : "") + '>' + '</td>';
            append += '</tr>';
        });

        $('#teachers')
            .find('tbody')
            .append(append)
            .parent().DataTable();
    }, 'json');
}

function updateTeacherPresentStatus(id, present) {
    const data = {
        id,
        present
    };

    $.post(UPDATE_TEACHER_PRESENT_URL, {
        data: JSON.stringify(data)
    });
}

function signin() {
    client.createSigninRequest({state: {bar: 15}}).then(function (req) {
        console.log("signin request", req, "<a href='" + req.url + "'>go signin</a>");
        window.location = req.url;
    }).catch(function (err) {
        console.log(err);
    });
}

function followLinks() {
    return localStorage.getItem("follow") === "true";
}
