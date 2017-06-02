define(['jquery', 'util/user', 'util/connection', 'datatables', 'noty'], function ($, user, connection, datatables, noty) {
    user.checkLoggedIn();

    $(document).on('change', '.present', function () {
        const element = $(this);
        updateCheckBox(element);
    });

    function updateCheckBox(element) {
        const id = element.data('id');
        const present = element.prop('checked');

        updateTeacherPresentStatus(id, present);
    }

    $(document).on('click', '#btnFetchTeachers', function () {
        const element = $('#btnFetchTeachers');
        element.attr('disabled', 'true');

        const notification = noty({
            text: 'Refreshing all teachers...',
            theme: 'relax',
            layout: 'topCenter',
            type: 'warning',
            force: true,
            timeout: false
        });

        connection.fetchTeachersFromApi().always(function () {
            element.removeAttr('disabled');
        }).done(function () {
            fillTeachersTable();
            notification.close();

            noty({
                text: 'Successfully refreshed all teachers.',
                theme: 'relax',
                layout: 'topCenter',
                type: 'success',
                force: true,
                timeout: 5000
            });
        }).fail(function (xhr, status, error) {
            notification.close();

            noty({
                text: 'Failed to refresh teachers: ' + error,
                theme: 'relax',
                layout: 'topCenter',
                type: 'error',
                force: true,
                timeout: 5000
            });
        });
    });

    function fillTeachersTable() {
        connection.getAllPeople().done(function (response) {
            const table = $('#teachers').DataTable();
            table.clear();

            $.each(response, function (i, item) {
                if (item.personalTitle === null) {
                    return;
                }

                const checkBox = '<input type="checkbox" class="present" data-id="' + item.id + '" value="present"' + (item.present ? " checked" : "") + '>' + '</td>';
                const row = table.row.add([item.id, item.displayName, item.personalTitle, checkBox]).node();
                const element = $(row).find('td').eq(3);
                updatePresentCell(element, item.present);
            });

            table.draw();
        });
    }

    fillTeachersTable();

    function updateTeacherPresentStatus(id, present) {
        connection.updatePersonPresence(id, present);

        const element = $(`[data-id='${id}']`).parent();
        updatePresentCell(element, present);
    }

    function updatePresentCell(element, present) {
        element.toggleClass('success', present);
        element.toggleClass('danger', !present);
    }
});
