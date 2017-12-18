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
        var locaStorage = myApp.c.getLocalStorage(),
            formPDV = $('#painelCompra form'),
            formFinalizar = $('#modalFormMain form'),
            objFormFinalizar = new Form('form-finalizar'),
            inputCompraPDV = formPDV.find('input[name=total_compra]'),
            cbDia = 0,
            vlrTotalPromocao = 0,
            vlrTotalCompra = 0,
            itensPedido = [];
            

        myApp.c.ajaxApi ('operacional-main', locaStorage, function (a) {
            // cb do dia
            cbDia = a.cbDia;
            $('.detalheCompra .porcentagem-cb-dia').text(Util.formatNumber(cbDia) + '%');

            // usuario
            $('#painelCompra .funcionario').append(locaStorage.cpf_cnpj);

            // listView com as promocoes
            myApp.c.listView ('operacional-lista-promocoes', locaStorage, 'listPromocoes', function (a) {

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
                vlrTotalCompra = Util.formatNumberBR(inputCompraPDV.val());
                if(!vlrTotalCompra) {
                    $('#erro-avancar').html("Informe o valor da compra.").show();
                } else if(vlrTotalCompra < vlrTotalPromocao) {
                    $('#erro-avancar').html("O valor da compra não pode ser menor que o total do pedido (<b>" + Util.formatNumber(vlrTotalPromocao) + "</b>)").show();
                } else {
                    $('#erro-avancar').hide();
                    // modal finalizar
                    //objFormFinalizar.clear();
                    myApp.c.openModal('modalFormMain');
                }
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
                itensPedido = [];
                var vlrTotalCb = 0,
                    vlrUnidadePromocao = 0,
                    idPromocao = 0,
                    qtdSelecionada = 0;
            
                $('#listPromocoes li .list-promocoes').each(function(){
                    
                    // quantidade selecionada
                    qtdSelecionada = parseInt($(this).find('.nun-qtd').text());
                    if (qtdSelecionada) {

                        // valor total do CB para a promocao
                        vlrTotalCb += Util.formatNumberBR($(this).find('.cb label').text().substr(2));

                        // valor total da promocao (valor ja multiplicado pela quantidade)
                        vlrTotalPromocao += Util.formatNumberBR($(this).find('.vlr_total').text().substr(2));

                        // valor unidade da promocao
                        vlrUnidadePromocao = Util.formatNumberBR($(this).find('.vlr').text().substr(2));

                        // id da promocao
                        idPromocao = $($(this).find('div')[0]).data('promocao');

                        // itens do pedido
                        itensPedido.push({promocao: idPromocao, qtd: qtdSelecionada, vlr_unidade: vlrUnidadePromocao});

                    }
                    
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
            
            // btn pesquisar cliente
            formFinalizar.find('#btn-busca-cliente-pdv').on('click', function () {
                var CPF = formFinalizar.find('input[name=busca_cpf]').val();
                if (CPF) {
                    var btnHtml = this;
                    $(btnHtml).attr('disabled',true);
                    myApp.c.ajaxApi ('operacional-get-cliente-pdv', $.extend({busca_cpf: CPF, total_compra: vlrTotalCompra} ,locaStorage), function (a) {
                        if(!a) {
                            $('#erro-busca-cpf').html("Cliente não encontrado.").addClass('form-erro').show();
                        } else {
                            // nome do cliente
                            $('#erro-busca-cpf').html(a.cliente.name).removeClass('form-erro').show();
                            // opcoes de pagamento
                            $(objFormFinalizar['forma_pagamento']).html('');
                            objFormFinalizar.addOptionsSelect('forma_pagamento', a.formasPagamento);
                        }
                        $(btnHtml).removeAttr('disabled');
                    });
                }
            });
            
            // btn pesquisar cliente
            formFinalizar.find('#btn-finalizar-pdv').on('click', function () {
                var dadosFormFinalizar = objFormFinalizar.getFormData(),
                    forma_pagamento_name = $(objFormFinalizar.forma_pagamento).find(':selected').text(),
                    dadosFinalizar = $.extend(dadosFormFinalizar, {forma_pagamento_name, total_compra: vlrTotalCompra, cb_total: vlrCbTotal, promocoes: itensPedido, usuario: locaStorage});
                if (!dadosFinalizar.busca_cpf || !dadosFinalizar.forma_pagamento || !dadosFinalizar.cod_venda) {
                    myApp.c.notification('error', '&bull; Preencha todos os campos do formulário para finalizar.');
                } else {
                    myApp.c.ajaxApi ('operacional-finalizar-pdv', dadosFinalizar, function (a) {
                        myApp.c.notification('success', 'O pedido foi finalizado com sucesso.', 'Finalizado', Util.reloadPage);
                    });
                }
            });
        
        });
    }

}