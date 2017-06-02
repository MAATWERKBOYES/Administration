$(document).ready(function () {
    loadQuestions();
});

$(document).on('click', '.edit', function () {
    const element = $(this);
    const id = element.data('id');

    openQuestionDetailOverview(id);
});

function loadQuestions() {
    $.get(REQUEST_QUESTIONS_URL, function (data) {
        let append = '';

        $.each(data, function (i, item) {
            append += '<tr>';
            append += '<td>' + item.question + '</td>';
            append += '<td>' + item.type + '</td>';
            append += '<td><button type="button" class="edit btn btn-success" data-id="' + item.id + '"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button></td>';
            append += '</tr>';
        });

        $('#questions')
            .find('tbody')
            .append(append)
            .parent().DataTable();
    }, 'json');
}

function openQuestionDetailOverview(id) {
    console.log(id);
}