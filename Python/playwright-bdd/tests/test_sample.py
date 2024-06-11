from pytest_bdd import scenarios
from playwright.sync_api import sync_playwright
# Import unified steps Given/When/Then
from features.feature_browser import *

# BDD tests
scenarios('test_sample.feature')
