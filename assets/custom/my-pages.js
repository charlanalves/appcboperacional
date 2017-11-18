class LoadPage {

    constructor() {
    }

    login(page) {
        var loginForm = new Form('login-form');
        loginForm.form.find('#btn-submit').on('click', function() {
            myApp.c.ajaxApi('operacional-login', loginForm.getFormData(), myApp.c.callbackLogin);
        });
    }
    
    main(page) {
        
        // var GLOBAL
        var formPDV = $('#painelCompra form'),
            inputCompraPDV = formPDV.find('input[name=total_compra]'),
            cbDia = 10,
            vlrTotalPromocao = 0;
    
        // cb do dia            
        $('.detalheCompra .porcentagem-cb-dia').text(cbDia + '%');
    
        // listView com as promocoes
        myApp.c.listView ('operacional-lista-promocoes', {}, 'listPromocoes', function (a) {
            
            // menos 1 na promoção
            $('#listPromocoes .fa-minus-circle').on('click', function () {
                var campoQuantidade = $(this).next(),
                    idPromocao = $(this).parent().parent().data('promocao');
                editaQuantidadePromocao(idPromocao, campoQuantidade, -1);
            });

            // mais 1 na promoção
            $('#listPromocoes .fa-plus-circle').on('click', function () {
                var campoQuantidade = $(this).prev(),
                    idPromocao = $(this).parent().parent().data('promocao');
                editaQuantidadePromocao(idPromocao, campoQuantidade, +1);
            });

        }, false, false);

        // btn avancar
        formPDV.find('#btn-avancar').on('click', function () {
            var vlrTotalCompra = Util.formatNumberBR(inputCompraPDV.val());
            if(vlrTotalCompra>0) {
                if(vlrTotalCompra < vlrTotalPromocao) {
                    $('#erro-valor-menor b').html(Util.formatNumber(vlrTotalPromocao));
                    $('#erro-valor-menor').show();
                } else {
                    $('#erro-valor-menor').hide();            
                    myApp.c.openModal('modalFormMain');
                }
            }
        });

        // avancar
        $('#close-modalFormMain').on('click', function () {
            myApp.c.closeModal('modalFormMain');
        });

        inputCompraPDV.keyup(function () {
            calcTotalCbPromocao();
            calcTotalCbDia();
            calcTotalCb();
        });

        // calcula total da promocao
        var callbackQtdPromocao = function (idPromocao, qtd) {
            var promocao = $('div[data-promocao="' + idPromocao + '"]'),
                vlr = Util.formatNumberBR(promocao.find('.vlr').text().substr(2)),
                cb = Util.formatNumberBR(promocao.find('.cb  small').text().slice(0,-1)),
                total = Util.formatNumber(vlr*qtd),
                cbVlr = Util.formatNumber((vlr*qtd) * (cb / 100));
            promocao.find('.cb label').text('R$ ' + cbVlr);
            promocao.find('.vlr_total').text('R$ ' + total);

        };

        // calcula CB total do dia
        var calcTotalCbDia = function () {
            var vlrTotalCompra = Util.formatNumberBR(inputCompraPDV.val());
            if(vlrTotalCompra >= vlrTotalPromocao) {
                var cbVlr = Util.formatNumber((vlrTotalCompra - vlrTotalPromocao) * (cbDia / 100));
                $('.detalheCompra .total-cb-dia').text(cbVlr);
                $('#erro-valor-menor').hide();
            }
        };

        // calcula CB total da promocao
        var calcTotalCbPromocao = function () {
            // global
            vlrTotalPromocao = 0;
            var vlrTotalCb = 0;
            $('#listPromocoes li .list-promocoes').each(function(){
                vlrTotalCb += Util.formatNumberBR($(this).find('.cb label').text().substr(2));
                vlrTotalPromocao += Util.formatNumberBR($(this).find('.vlr_total').text().substr(2));
            });
            $('.detalheCompra .total-cb-promocao').text(Util.formatNumber(vlrTotalCb));
        };

        // calcula CB total da promocao
        var calcTotalCb = function () {
            var vlrCbDia = Util.formatNumberBR($('.detalheCompra .total-cb-dia').text()),
                vlrCbPromocao = Util.formatNumberBR($('.detalheCompra .total-cb-promocao').text());
            $('.detalheCompra .total-cb').text(Util.formatNumber(vlrCbDia + vlrCbPromocao));
        };

        // calcula total da promocao
        var editaQuantidadePromocao = function (idPromocao, campoQuantidade, qtd) {
            var novaquantidade = parseInt(campoQuantidade.text()) + parseInt(qtd);
            if (novaquantidade >= 0) {
                campoQuantidade.text(novaquantidade);
                callbackQtdPromocao(idPromocao, novaquantidade);
                calcTotalCbPromocao();
                calcTotalCbDia();
                calcTotalCb();
            }
        };
    }

}