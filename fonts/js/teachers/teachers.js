$(document).ready(function () {
    loadTeachers();
});

function loadTeachers() {
    $.get(REQUEST_TEACHERS_URL, function (data) {
        var append = '';

        $.each(data, function (i, item) {
            append += '<tr>';
            append += '<td>' + item.displayName + '</td>';
            append += '<td>' + item.personalTitle + '</td>';
            append += '</tr>';
        });

        $('#teachers > tbody').append(append);
        $('#teachers').DataTable();
    }, "json");
}
