requirejs.config({
    urlArgs: 'time=' + (new Date()).getTime(),
    baseUrl: 'js',

    shim: {
        'util/navbar': {'deps': ['jquery', 'bootstrap']},
        'util/user': {'deps': ['jquery', 'oidc', 'util/connection']},
        'bootstrap': {'deps': ['jquery']},
        'bootbox': {'deps': ['jquery', 'bootstrap']},
        'datatables.net': {'deps': ['jquery']},
        'datatables': {'deps': ['datatables.net', 'bootstrap']},
    },

    paths: {
        jquery: 'lib/jquery-3.2.1.min',

        bootstrap: 'lib/bootstrap.min',
        'datatables.net': 'lib/jquery.dataTables.min',
        datatables: 'lib/dataTables.bootstrap.min',
        bootbox: 'lib/bootbox.min',

        noty: 'lib/jquery.noty.packaged.min',
        oidc: 'lib/oidc-client.min',

        lib: './lib',
        util: './util',
        app: './app'
    }
});

requirejs(['jquery', 'bootstrap', 'util/navbar']);
