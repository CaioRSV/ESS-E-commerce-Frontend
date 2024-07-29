Feature: Visualizar Histórico de Pedidos

Scenario: Visualizar histórico de usuário
    Given O usuário comum de email "teste@gmail.com" está logado
    When O usuário acessa a funcionalidade de listar pedidos
    Then Os pedidos existentes do usuário devem ser listados em sua tela
    
Scenario: Visualizar histórico de administrador
    Given O usuário administrador de email "admin@gmail.com" está logado
    When O administrador acessa a funcionalidade de listar pedidos
    Then A tela de busca por usuários deve ser exibida
    When O administrador pesquisar por um usuário de nome "Teste"
    Then Deve ser exibida na listagem a opção de visualizar o histórico de pedidos do usuário "Teste"
    When O administrador clicar na opção de visualizar histórico de pedidos de "Teste"
    Then Os pedidos existentes do usuário "Teste" devem ser listados em sua tela
