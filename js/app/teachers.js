define(['jquery', 'util/user', 'util/connection', 'datatables'], function ($, user, connection, datatables) {
    user.checkLoggedIn();

    $(document).on('change', '.present', function () {
        const element = $(this);
        const id = element.data('id');
        const present = element.prop('checked');

        updateTeacherPresentStatus(id, present);
    });


    connection.getAllPeople().done(function (response) {
        let append = '';

        $.each(response, function (i, item) {
            if (item.personalTitle === null) {
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
    });

    function updateTeacherPresentStatus(id, present) {
        connection.updatePersonPresence(id, present);
    }
});
