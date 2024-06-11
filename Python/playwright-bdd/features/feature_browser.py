from pytest_bdd import given, when, then, parsers
import time
from features.feature_params import get_config_param

# -----------Given-------------------------
@given('I open the browser')
def open_browser(browser):
    pass

@given('a new tab is in focus')
def focus_on_tab(page):
    page.new_page.bring_to_front()
    page.new_page.wait_for_load_state()

# -----------When--------------------------
@when(parsers.parse('I navigate to "{url}"'))
def navigate_to(page, env, url):
    if (url.startswith("configs.")):
        url = get_config_param(url, env)
    page.goto(url)

@when(parsers.parse('I wait for "{timer}" seconds'))
def wait_seconds(timer):
    time.sleep(int(timer))

@when('I reload the page')
def reload_page(page):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    page.reload()

@when(parsers.parse('I wait for page reload'))
def wait_load_state(page):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    page.wait_for_load_state('load')

# -----------Then--------------------------
@then(parsers.parse('the page title should be "{title}"'))
def check_page_title(page, env, title):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (title.startswith("configs.")):
        title = get_config_param(title, env)
    assert page.title() == title, f"Expected '{title}', but got '{page.title()}'"

@then(parsers.parse('the url is match with "{url}"'))
def check_page_url(page, env, url):
    if (url.startswith("configs.")):
        url = get_config_param(url, env)
    assert url in page.url, f"Expected URL '{url}' matching with '{page.url}'"

@then(parsers.parse('the tab url is "{url}"'))
def check_tab_url(page, env, url):
    if (url.startswith("configs.")):
        url = get_config_param(url, env)
    assert page.new_page.url == url, f"Expected URL '{url}', but got '{page.new_page.url}'"

@then(parsers.parse('the tab url is match with "{url}"'))
def check_page_url(page, env, url):
    if (url.startswith("configs.")):
        url = get_config_param(url, env)
    assert url in page.new_page.url, f"Expected URL '{url}' matching with '{page.url}'"

@then('a new tab is opened')
def check_new_tab(page):
    assert hasattr(page, 'new_page'), 'No new page was opened'
