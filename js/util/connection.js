define(['jquery'], function ($) {
    const API_HOST_URL = 'http://145.93.96.177:8080/';
    const LOGIN_URL = API_HOST_URL + 'login';

    const REQUEST_ALL_PEOPLE_URL = API_HOST_URL + 'people';
    const FETCH_TEACHERS_FROM_API_URL = API_HOST_URL + 'people/save';
    const REQUEST_SELF_PERSON_URL = API_HOST_URL + 'people/me';
    const UPDATE_PERSON_PRESENCE_URL = API_HOST_URL + 'people/{id}/presence';

    const REQUEST_QUESTIONS_URL = API_HOST_URL + 'questions';

    const connection = {};

    connection.loginToApi = function (token) {
        return $.post(LOGIN_URL, {
            token
        });
    };

    connection.fetchTeachersFromApi = function () {
        return $.get(FETCH_TEACHERS_FROM_API_URL);
    };

    connection.getAllPeople = function () {
        return $.get(REQUEST_ALL_PEOPLE_URL);
    };

    connection.getSelfPerson = function () {
        return $.get(REQUEST_SELF_PERSON_URL);
    };

    connection.updatePersonPresence = function (id, present) {
        return $.post(UPDATE_PERSON_PRESENCE_URL.replace("{id}", id), {
            'value': present
        });
    };

    return connection;
});
