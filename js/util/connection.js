define(['jquery', 'util/connection_config'], function ($) {
    const API_HOST_URL = `http://${CONNECTION_CONFIG.connection_host}:${CONNECTION_CONFIG.connection_port}/`;
    const LOGIN_URL = API_HOST_URL + 'login';

    const REQUEST_ALL_PEOPLE_URL = API_HOST_URL + 'people';
    const FETCH_TEACHERS_FROM_API_URL = API_HOST_URL + 'people/save';
    const REQUEST_SELF_PERSON_URL = API_HOST_URL + 'people/me';
    const UPDATE_PERSON_PRESENCE_URL = API_HOST_URL + 'people/{id}/presence';

    const REQUEST_ALL_DEPARTMENTS_URL = API_HOST_URL + 'department';
    const REQUEST_ALL_QUESTIONS_URL = API_HOST_URL + 'question';
    const UPDATE_QUESTION_URL = API_HOST_URL + 'question';
    const REMOVE_QUESTION_URL = API_HOST_URL + 'question/{id}/remove';
    const REQUEST_SINGLE_QUESTION_URL = API_HOST_URL + 'question/{id}';

    const connection = {};

    connection.loginToApi = function (token) {
        return $.post(LOGIN_URL, {
            token
        });
    };

    connection.fetchTeachersFromApi = function () {
        return $.get(FETCH_TEACHERS_FROM_API_URL);
    };

    connection.getAllDepartments = function () {
        return $.get(REQUEST_ALL_DEPARTMENTS_URL);
    };

    connection.getAllQuestions = function () {
        return $.get(REQUEST_ALL_QUESTIONS_URL);
    };

    connection.getQuestion = function (id) {
        return $.get(REQUEST_SINGLE_QUESTION_URL.replace("{id}", id));
    };

    connection.updateQuestion = function (question) {
        return $.ajax({
            type: 'POST',
            url: UPDATE_QUESTION_URL,
            data: JSON.stringify(question),
            contentType: "application/json"
        });
    };

    connection.removeQuestion = function (id) {
        return $.post(REMOVE_QUESTION_URL.replace("{id}", id));
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
