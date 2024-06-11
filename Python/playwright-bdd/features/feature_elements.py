import random
from playwright.sync_api import expect
from pytest_bdd import when, then, parsers
from features.feature_params import get_config_param

def nested_locator(page, css):
    selectors = css.split(' ')
    locator = page.locator(selectors[0])
    for sel in selectors[1:]:
        locator = locator.locator(sel)
    return locator

# -----------When--------------------------
@when(parsers.parse('I click on "{name}" ({type})'))
def click_by_role_and_name(page, env, name, type):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (name.startswith('configs.')):
        name = get_config_param(name, env)
    page.get_by_role(type, name=name).click()

@when(parsers.parse('I click on "{text}" link'))
def click_on_link(page, text):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    page.click(f"text={text}")
    page.wait_for_load_state('load')

@when(parsers.parse('I click on exact "{text}" link'))
def click_on_exact_link(page, text):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    page.get_by_text(text, exact=True).click()
    page.wait_for_load_state('load')

@when(parsers.parse('I click on exact "{name}" ({type})'))
def click_by_role_and_name(page, env, name, type):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (name.startswith('configs.')):
        name = get_config_param(name, env)
    page.get_by_role(type, name=name, exact=True).click()

@when(parsers.parse('I click on visible "{text}" link'))
def click_on_visible_link(page, text):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    elements = page.locator(f"text={text}")
    clicked = False
    for i in range(elements.count()):
        if elements.nth(i).is_visible():
            elements.nth(i).click()
            page.wait_for_load_state('load')
            clicked = True
            break
    assert clicked, f"No visible link with text '{text}' was found"

@when(parsers.parse('I click on "{link}" external link'))
def click_on_external_link(page, link):
    me = page
    if hasattr(page, 'new_page') and page.new_page:
        me = page.new_page
    with me.expect_popup() as new_page_info:
        click_on_link(me, link)
    new_page = new_page_info.value
    page.new_page = new_page

@when(parsers.parse('I click on visible "{text}" external link'))
def click_on_visible_link(page, text):
    me = page
    if hasattr(page, 'new_page') and page.new_page:
        me = page.new_page
    elements = page.locator(f"text={text}")
    clicked = False
    for i in range(elements.count()):
        if elements.nth(i).is_visible():
            with me.expect_popup() as new_page_info:
                elements.nth(i).click()
                page.wait_for_load_state('load')
            new_page = new_page_info.value
            page.new_page = new_page
            clicked = True
            break
    assert clicked, f"No visible link with text '{text}' was found"

@when(parsers.parse('I click on "{css}" element'))
def click_on_element(page, env, css):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    nested_locator(page, css).click()

@when(parsers.parse('I click on "{css}" element in "{main_css}" nearby "{text}"'))
def click_on_element_nearby_text(page, env, css, main_css, text):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    if (main_css.startswith('configs.')):
        main_css = get_config_param(main_css, env)
    page.locator(main_css, has_text=text).locator(css).click()

@when(parsers.parse('I click on "{css}" external element'))
def click_on_external_element(page, env, css):
    me = page
    if hasattr(page, 'new_page') and page.new_page:
        me = page.new_page
    with me.expect_popup() as new_page_info:
        click_on_element(me, env, css)
    new_page = new_page_info.value
    page.new_page = new_page

@when(parsers.parse('I click on "{id}" locator'))
def click_on_locator(page, id):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    page.get_by_test_id(id).click()

@when(parsers.parse('I click on "{css}" external locator'))
def click_on_external_locator(page, id):
    me = page
    if hasattr(page, 'new_page') and page.new_page:
        me = page.new_page
    with me.expect_popup() as new_page_info:
        click_on_locator(me, id)
    new_page = new_page_info.value
    page.new_page = new_page

@when(parsers.parse('I focus on "{css}" element'))
def focus_on_element(page, env, css):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    nested_locator(page, css).focus()

@when(parsers.parse('I focus on "{name}" ({type})'))
def focus_on_element_with_type(page, env, name, type):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    page.get_by_role(type, name=name).click()

@when(parsers.parse('I press "{key}" for "{css}" field'))
def type_into_field_and_press_enter(page, env, key, css):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    field = page.locator(css)
    field.press(key)

@when(parsers.parse('I scroll to "{text}" link'))
def scroll_to_link(page, text):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    link_locator = page.locator(f'text="{text}"')
    link_locator.wait_for(state="attached", timeout=12000)
    link_locator.scroll_into_view_if_needed()

@when(parsers.parse('I scroll to "{css}" element'))
def scroll_to_element(page, env, css):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    link_locator = nested_locator(page, css)
    link_locator.wait_for(state="attached", timeout=12000)
    link_locator.scroll_into_view_if_needed()

@when(parsers.parse('I type "{value}" into "{selector}" field'))
def type_into_field(page, env, value, selector):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (value.startswith('configs.')):
        value = get_config_param(value, env)
    if (selector.startswith('configs.')):
        selector = get_config_param(selector, env)
    page.fill(selector, value)

@when(parsers.parse('I type random "{count}" numbers into "{selector}" field'))
def type_random_numbers(page, env, count, selector):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (selector.startswith('configs.')):
        selector = get_config_param(selector, env)
    random_number = ''.join(str(random.randint(0, 9)) for _ in range(int(count)))
    page.fill(selector, random_number)

# -----------Then--------------------------
@then(parsers.parse('I expect to see "{name}" on the page'))
def expect_visible_on_the_page(page, env, name):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (name.startswith('configs.')):
        name = get_config_param(name, env)
    expect(page.get_by_text(name)).to_be_visible(timeout=12000)

@then(parsers.parse('I expect to see any "{name}" on the page'))
def expect_any_visible_on_the_page(page, env, name):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (name.startswith('configs.')):
        name = get_config_param(name, env)
    elements = page.locator(f"text={name}")
    for i in range(elements.count()):
        elements.nth(i).wait_for(state="attached", timeout=12000)
        if elements.nth(i).is_visible():
            expect(elements.nth(i)).to_be_visible(timeout=12000)
            return
    raise AssertionError(f"No visible elements found with text '{name}'")

@then(parsers.parse('I expect to see exact "{name}" on the page'))
def expect_exact_visible_on_the_page(page, env, name):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (name.startswith('configs.')):
        name = get_config_param(name, env)
    expect(page.get_by_text(name, exact=True)).to_be_visible(timeout=12000)

@then(parsers.parse('I expect to see "{name}" {type} on the page'))
def expect_link_visible_on_the_page(page, env, name, type):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (name.startswith('configs.')):
        name = get_config_param(name, env)
    expect(page.get_by_role(type, name=name)).to_be_visible(timeout=12000)

@then(parsers.parse('I expect to see locator "{id}" on the page'))
def expect_locator_visible_on_the_page(page, env, id):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (id.startswith('configs.')):
        id = get_config_param(id, env)
    expect(page.get_by_test_id(id)).to_be_visible(timeout=12000)

@then(parsers.parse('I expect "{css}" container to have elements:\n{elements}'))
def expect_elements_on_the_page(page, env, css, elements):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    for element in elements.split('\n'):
        locator = page.locator(css).get_by_text(element.strip()).first
        locator.scroll_into_view_if_needed()
        expect(locator).to_be_visible(timeout=12000)

@then(parsers.parse('I expect not to find element with text "{text}"'))
def expect_not_to_find_element_with_text(page, text):
    elements = page.locator(f'text="{text}"')
    expect(elements).to_have_count(0)

@then(parsers.parse('the "{css}" input should be required with type "{type}"'))
def check_input_required(page, env, css, type):
    if hasattr(page, 'new_page') and page.new_page:
        page = page.new_page
    if (css.startswith('configs.')):
        css = get_config_param(css, env)
    input_locator = page.locator(css)
    required_attr = input_locator.get_attribute('required')
    assert required_attr is not None, f'The input "{css}" is not required'
    type_attr = input_locator.get_attribute('type')
    assert type_attr == type, f'Expected input type "{type}", taken "{type_attr}"'
