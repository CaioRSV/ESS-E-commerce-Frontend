Feature: Category
  Scenario: User creates a new category successfully
    Given the user is logged as admin
    Given the user is on the Categories page
    When the user opens the create category dialog
    And the user enters "Tênis" in the category name input
    And the user enters "https://cdn-icons-png.flaticon.com/512/500/500225.png" in the category image input
    And the user clicks the "Criar" button
    Then a new category with name "Tênis" should be added to the list
