define(['jquery', 'util/user', 'util/connection', 'datatables', 'noty', 'bootbox'], function ($, user, connection, datatables, noty, bootbox) {
    user.checkLoggedIn();

    let dialog;

    $(document).on('click', '.btnEdit', function () {
        const element = $(this);
        const id = $(this).data('id');

        requestAndEditQuestion(id);
    });

    $(document).on('click', '#btnAddQuestion', function () {
        editQuestion({
            id: null,
            value: '',
            team: null,
            answers: []
        });
    });

    $(document).on('click', '.btnRemove', function () {
        const element = $(this).parent().parent().remove();
    });

    $(document).on('click', '.btnCorrectness', function () {
        const element = $(this);
        updateCorrectness(element, false);
    });

    $(document).on('click', '#btnAddAnswer', function () {
        if (dialog === null || dialog === undefined) {
            return;
        }

        const answerData = getAnswerTableLineHtmlData({
            id: null,
            value: null
        });
        $('#tableAnswers').find('> tbody').append(answerData);
    });

    $(document).on('click', '#btnSaveQuestion', function () {
        const element = $(this);
        const questionId = element.data('id');
        const questionText = $('#txtQuestion').val();
        const department = $('#selectType').val();

        const question = {
            id: questionId,
            value: questionText,
            department: department,
            answers: []
        };

        $(".txtAnswer").each(function (i, item) {
            question.answers.push({
                id: $(this).data('id'),
                correct: isBtnCorrect($(this).parent().parent().children().eq(2).children().eq(0)),
                value: $(this).val()
            });
        });

        connection.updateQuestion(question).done(function () {
            fillQuestionsTable();

            dialog.modal('hide');
            dialog = null;
        });
    });

    $(document).on('click', '.btnRemoveQuestion', function () {
        const element = $(this);
        const id = $(this).data('id');

        removeQuestion(id);
    });

    function removeQuestion(id) {
        connection.removeQuestion(id).done(fillQuestionsTable);
    }

    function isBtnCorrect(element) {
        return element.hasClass('btn-success');
    }

    function requestAndEditQuestion(id) {
        connection.getQuestion(id).done(editQuestion);
    }

    function editQuestion(question) {
        dialog = bootbox.dialog({
            title: 'Editing question',
            message: 'Loading question data...'
        });

        connection.getAllDepartments().done(function (departments) {
            const questionTableHtmlData = getQuestionTableHtmlData([
                {name: 'Question', value: getQuestionInputHtmlData(question)},
                {name: 'Type', value: getSelectHtmlData(question, departments)}
            ]);

            const answersTableHtmlData = getAnswersTableHtmlData(question.answers);
            const btnSubmitHtmlData = `<button id="btnSaveQuestion" data-id="${question.id}" class="btn btn-success">Save question</button>`;

            const element = dialog
                .find('.bootbox-body')
                .empty()
                .append('<h1>Question</h1>')
                .append(questionTableHtmlData)
                .append('<h1>Answers</h1>')
                .append(answersTableHtmlData)
                .append(btnSubmitHtmlData);
        });
    }

    function getQuestionInputHtmlData(data) {
        return `<input type="text" class="form-control" id="txtQuestion" value="${data.value}">`;
    }

    function getQuestionTableHtmlData(data) {
        let tableQuestionsHtml = '';
        tableQuestionsHtml += '<table id="tableQuestions" class="table table-striped table-bordered table-hover">';
        tableQuestionsHtml += '<tbody>';

        $.each(data, function (i, item) {
            tableQuestionsHtml += '<tr>';
            tableQuestionsHtml += `<td>${item.name}</td><td>${item.value}</td>`;
            tableQuestionsHtml += '</tr>';
        });

        tableQuestionsHtml += '</tbody>';
        tableQuestionsHtml += '</table>';
        return tableQuestionsHtml;
    }

    function getAnswersTableHtmlData(data) {
        let tableAnswersHtml = '';
        tableAnswersHtml += '<table id="tableAnswers" class="table table-striped table-bordered table-hover">';
        tableAnswersHtml += '<tbody>';

        $.each(data, function (i, item) {
            tableAnswersHtml += getAnswerTableLineHtmlData(item);
        });

        tableAnswersHtml += '</tbody>';
        tableAnswersHtml += '</table>';
        tableAnswersHtml += `<button id="btnAddAnswer" class="btn btn-warning">Add answer</button>`;
        return tableAnswersHtml;
    }

    function getAnswerTableLineHtmlData(answer) {
        let tableAnswerLineHtml = '';

        tableAnswerLineHtml += '<tr>';
        tableAnswerLineHtml += `<td>Answer</td><td>${getAnswerInputHtmlData(answer)}</td><td>${getAnswerCorrectnessHtmlData(answer)} ${getAnswerRemoveHtmlData(answer)}</td>`;
        tableAnswerLineHtml += '</tr>';

        return tableAnswerLineHtml;
    }

    function getAnswerInputHtmlData(answer) {
        return `<input type="text" class="txtAnswer form-control" data-id="${answer.id}" value="${answer.value === null ? '' : answer.value}">`;
    }

    function getAnswerCorrectnessHtmlData(answer) {
        return `<button type="button" class="btnCorrectness btn ${answer.correct ? 'btn-success' : 'btn-warning'} btn-sm" data-id="${answer.id}">` +
            `<span class="glyphicon glyphicon-thumbs-${answer.correct ? 'up' : 'down'}" aria-hidden="true"></span>` +
            '</button>';
    }

    function getAnswerRemoveHtmlData(answer) {
        return `<button type="button" class="btnRemove btn btn-danger btn-sm" data-id="${answer.id}">` +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</button>';
    }

    function getSelectHtmlData(question, data) {
        let selectHtml = '';
        selectHtml += '<select id="selectType">';

        $.each(data, function (i, item) {
            selectHtml += `<option value="${item}" ${(question.department === item ? 'selected' : '')}>${item}</option>`;
        });

        selectHtml += '</select>';
        return selectHtml;
    }

    function fillQuestionsTable() {
        connection.getAllQuestions().done(function (response) {
            const table = $('#questions').DataTable();
            table.clear();

            $.each(response, function (i, item) {
                const buttons = `${getEditButtonHtmlData(item)} ${getRemoveButtonHtmlData(item)}`;
                table.row.add([item.value, item.department, item.answers.length, buttons]).node();
            });

            table.draw();
        });
    }

    function getRemoveButtonHtmlData(question) {
        return `<button type="button" class="btnRemoveQuestion btn btn-danger btn-sm" data-id="${question.id}">` +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</button>';
    }

    function getEditButtonHtmlData(question) {
        return `<button type="button" class="btnEdit btn btn-success btn-sm" data-id="${question.id}">` +
            '<span class="glyphicon glyphicon-edit" aria-hidden="true"></span>' +
            '</button>';
    }

    function updateCorrectness(btnElement) {
        const correct = !isBtnCorrect(btnElement);

        btnElement.toggleClass('btn-success', correct);
        btnElement.toggleClass('btn-warning', !correct);

        const spanElement = btnElement.children().eq(0);
        spanElement.toggleClass('glyphicon-thumbs-up', correct);
        spanElement.toggleClass('glyphicon-thumbs-down', !correct);
    }

    fillQuestionsTable();
});
