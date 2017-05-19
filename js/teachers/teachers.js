$(document).ready(function () {
    loadTeachers();
});

$(document).on('change', '.present', function () {
    var element = $(this);
    var id = element.data('id');
    var present = element.prop('checked');

    updateTeacherPresentStatus(id, present);
});


function loadTeachers() {
    $.get(REQUEST_TEACHERS_URL, function (data) {
        var append = '';

        $.each(data, function (i, item) {
            append += '<tr>';
            append += '<td>' + item.id + '</td>';
            append += '<td>' + item.displayName + '</td>';
            append += '<td>' + item.personalTitle + '</td>';
            append += '<td>' + '<input type="checkbox" class="present" data-id="' + item.id + '" value="present"' + (item.present ? " checked" : "") + '>' + '</td>';
            append += '</tr>';
        });

        $('#teachers').find('tbody')
            .append(append)
            .parent().DataTable();
    }, 'json');
}

function updateTeacherPresentStatus(id, present) {
    var data = {
        id: id,
        present: present
    };

    $.post(REQUEST_TEACHERS_URL, {
        data: JSON.stringify(data)
    });
}

