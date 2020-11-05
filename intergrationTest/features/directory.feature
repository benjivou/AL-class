Feature: cucumber test


  Scenario Outline: user do the authentification
    Given controller connect with <user> and <pwd>
    When I send GET request to authentification service
    Then I receive <response>

    Examples:
      | user     | pwd      | response                 |
      | julien   | julien   | 5f99ac7584b0c83808bb1a95 |


  Scenario Outline: the controller connect to the app and check a valid ticket
    Given controller connect to the app with <user> and <pwd> then he scan the <qr> code from the ticket
    When controller send GET request to ticket ckeck service
    Then controller receive <result> and <type>

    Examples:
      | user     | pwd      | qr       | result | type   |
      | julien   | julien   | rf379190 | true   | normal |


  Scenario Outline: the controller connect to the app and check unvalid ticket and declare fraud ( cash payment )
    Given connexion with <user> and <pwd> and ticket <qr> code
    When  send GET request to ticket ckeck service
    Then the result are <result> and <type> and <paymentCheck>

    Examples:
      | user     | pwd      | qr       | result  | type           | paymentCheck   |
      | julien   | julien   | rf37919  | false   | ticket unfound | Already paid ! |


  Scenario Outline: the controller connect to the app and check valid ticket but not reduced and declare fraud ( cart payment )
    Given the controller <user> and <pwd> and ticket <qr> code
    When  send the request to ticket check to verify
    Then the controller verify the payment <result> and <type> and <paymentCheck>

    Examples:
      | user     | pwd      | qr        | result  | type    | paymentCheck |
      | julien   | julien   | rf37yeuz0 | true    | reduced | true         |






