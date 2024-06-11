Feature: Sample Test

    Scenario: Open google.com and check title
        Given I open the browser
        When I navigate to "configs.sample.google-url"
        Then the page title should be "Google"

    @only
    Scenario: Open python.org and check title
        Given I open the browser
        When I navigate to "https://www.python.org"
        Then the page title should be "Welcome to Python.org"

    Scenario Outline: Multiple checks of titles per defined pages
        Given I open the browser
        When I navigate to "<url>"
        Then the page title should be "<title>"

    Examples:
        | url                       | title                  |
        | https://www.python.org    | configs.sample.title   |
        | configs.sample.google-url | Google                 |
