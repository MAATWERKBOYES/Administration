define(['jquery', 'util/user', 'util/connection', 'datatables', 'noty'], function ($, user, connection, datatables, noty) {
    user.checkLoggedIn();

    $(document).on('change', '.presentCheckBox', function () {
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

                const checkBox = `<input type="checkbox" class="presentCheckBox" data-id="${item.id}" value="present" ${(item.present ? "checked" : "")}> <span class="presentSpan" data-id="${item.id}"> ${(item.present ? "P" : "N")}</span>`;
                const row = table.row.add([item.id, item.displayName, item.personalTitle, checkBox]).node();
                const column = $(row).find('td').eq(3);

                const checkBoxElement = column.find('input');
                const spanElement = column.find('span');
                updatePresentCell(checkBoxElement, spanElement, item.present);
            });

            table.draw();
        });
    }

    fillTeachersTable();

    function updateTeacherPresentStatus(id, present) {
        connection.updatePersonPresence(id, present);

        const checkBoxElement = $(`.presentCheckBox[data-id='${id}']`);
        const spanElement = $(`.presentSpan[data-id='${id}']`);
        updatePresentCell(checkBoxElement, spanElement, present);
    }

    function updatePresentCell(checkBoxElement, spanElement, present) {
        checkBoxElement.parent().toggleClass('success', present);
        checkBoxElement.parent().toggleClass('danger', !present);

        spanElement.text(` ${(present ? 'P' : 'N')}`);
    }
});
