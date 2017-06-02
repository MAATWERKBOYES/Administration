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

    $.post(UPDATE_TEACHER_PRESENT_URL.replace("{id}", id), data);
}
