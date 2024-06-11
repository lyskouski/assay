import os
import pytest
import time
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="module")
def browser(headless):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        yield browser
        browser.close()

@pytest.fixture
def context(browser):
    context = browser.new_context(
        record_video_dir="reports/",
        record_video_size={"width": 1024, "height": 768}
    )
    yield context
    context.close()

@pytest.fixture
def page(context, request):
    page = context.new_page()
    yield page
    video_path = page.video.path()
    page.close()
    if request.node.rep_call.outcome == "passed":
        time.sleep(1)
        try:
            if os.path.exists(video_path):
                os.remove(video_path)
        except PermissionError:
            time.sleep(0)