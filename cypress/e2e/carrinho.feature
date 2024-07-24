Feature: Cart Service

Scenario: Listar carrinho
    Given O usuário de email "teste@gmail.com" está logado
    When O usuário está na página Carrinho
    Then O usuário deve ver a lista de produtos em seu carrinho na tela

Scenario: Remover produto do carrinho
    Given O usuário de email "teste@gmail.com" está logado
    And Existe um produto de ID "1" no carrinho do usuário
    When O usuário clica no botão "Remover" correspondente ao produto de ID "1" no carrinho
    Then O produto deve ser removido da lista do carrinho

Scenario: Atualizar quantidade de produto no carrinho
    Given O usuário de email "teste@gmail.com" está logado
    And Existe um produto de ID "1" no carrinho do usuário
    And O usuário possui "1" unidade do produto especificado em seu carrinho
    When O usuário clica no botão "+" ao lado do produto de ID "1" no carrinho
    Then A quantidade do produto deve ser atualizada para "2" unidades e o usuário deve ver a nova quantidade na tela

    Scenario: Adicionar produto ao carrinho
    Given O usuário de email "teste@gmail.com" está logado1
    And Existe um produto de ID "1" disponível na loja
    When O usuário clica no botão "Adicionar ao Carrinho" do produto de ID "1"
    Then O usuário deve ver uma mensagem de confirmação e o produto deve aparecer na lista do carrinho