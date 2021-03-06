/* CONFIG */
myApp.c.setAppConfig({
    appLogo: './assets/img/logo.png',
    appName: 'Estaleca - PDV',
    appSlogan: 'operacional',
    pages: ['main'],
    indexPage: 'main.html',
    
    urlApi: 'http://estalecas.com.br/api/frontend/web/index.php?r=api-empresa/',
    urlImg: 'http://estalecas.com.br/api/frontend/web/img/',

    /*
    urlApi: 'http://localhost/cashback/frontend/web/index.php?r=api-empresa/',
    urlImg: 'http://localhost/cashback/frontend/web/img/',
    
	urlApi: 'http://localhost/apiestalecas/frontend/web/index.php?r=api-empresa/',
    urlImg: 'http://localhost/apiestalecas/frontend/web/img/'
	*/
});
myApp.c.setPanelLeft([
    {href: 'main.html', label: 'PDV', ico: 'usd'},
    {label: 'Sair', ico: 'close', class: 'my-logout'}
]);
/* CONFIG */

/* INIT */
myApp.c.init();
