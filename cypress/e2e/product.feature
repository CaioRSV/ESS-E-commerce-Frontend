Feature: Menu Items

  Background:
    Given O usuário está logado como admin
    And O usuário está na página principal
    Then O usuário deve ver a lista de produtos na tela

  Scenario: Inserção de novo produto
    Given O usuário está logado como admin
    And O usuário está na página de adminstração de produtos
    When O usuário insere "All star alto" na caixa de input "Nome da peça"
    And O usuário insere "https://example.com/allstar.jpg" na caixa de input "Imagem da peça"
    And O usuário insere "105.99" na caixa de input "Preço"
    And O usuário insere "53" na caixa de input "Estoque"
    And O usuário seleciona "Tênis" na caixa de seleção da "Categoria"
    And O usuário insere "All Star cano alto rosa" na caixa de input "Descrição"
    Then um novo produto é criado e exibido no menu com o nome "All star cano alto"

  Scenario: Seleção de produto existente
    Given O usuário está logado como admin
    And O usuário está na página de adminstração de produtos
    When O usuário seleciona o produto "All star alto" na lista de produtos
    Then A caixa de edição do produto é aberta

  Scenario: Edição de produto existente
    Given O produto "All star alto" está selecionado
    When O usuário insere "0" na caixa de input "Preço"
    Then o produto é atualizado
    And é exibido na listagem de produtos o produto com o novo preço

  Scenario: Deletando um item existente
    Given O produto "All star alto" está selecionado
    When O usuário clica em "Deletar"
    Then o produto é deletado
    And não é exibido na listagem de produtos
