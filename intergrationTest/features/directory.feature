Feature: cucumber test


  Scenario Outline: get contact
    Given controller connect to the app with <user> and <pwd>
    When I send GET request to authentification service
    Then I receive <response>

    Examples:
      | user     | pwd      | response                 |
      | julien   | julien   | 5f99ac7584b0c83808bb1a95 |

