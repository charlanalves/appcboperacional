/* CONFIG */
myApp.c.setAppConfig({
    appLogo: './assets/img/logo.png',
    appName: 'Estaleca - PDV',
    appSlogan: 'operacional',
    pages: ['main'],
    indexPage: 'main.html',
    urlApi: 'http://www.estalecas.com.br/api/frontend/web/index.php?r=api-empresa/',
    urlImg: 'http://www.estalecas.com.br/api/frontend/web/img/'
});
myApp.c.setPanelLeft([
    {href: 'main.html', label: 'PDV', ico: 'usd'},
    {label: 'Sair', ico: 'close', class: 'my-logout'}
]);
/* CONFIG */

/* INIT */
myApp.c.init();