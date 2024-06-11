import logging
import sys
from fixtures.fixture_base import *

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Hook to trace headless argument from a command line
def pytest_addoption(parser):
    parser.addoption(
        "--headless", 
        action="store_true", 
        default=False, 
        help="Run browser in headless mode"
    )
    parser.addoption(
        "--env",
        action="store",
        default=None,
        help="Environment to select the configuration value"
    )

@pytest.fixture(scope="module")
def headless(request):
    return request.config.getoption("--headless")

@pytest.fixture(scope="module")
def env(request):
    return request.config.getoption("--env")

# Hook to add the test result to the request node
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    # Execute all other hooks to obtain the report object
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_call", rep)

def pytest_bdd_apply_tag(tag, function):
    if tag == 'todo':
        marker = pytest.mark.skip(reason="Not implemented yet")
        marker(function)
        return True
    else:
        # Fall back to the default behavior of pytest-bdd
        return None

# Plot failed BDD notation
def pytest_bdd_step_error(request, feature, scenario, step, step_func, step_func_args, exception):
    logger.info(f"\n\n[FAILED] Scenario: {scenario.name}\n         Step: {step.keyword} {step.name}\n         Error: {exception}\n\n")

# Add a pytest hook to print to the terminal directly
@pytest.hookimpl(trylast=True)
def pytest_report_header(config):
    terminal_reporter = config.pluginmanager.getplugin('terminalreporter')
    if terminal_reporter is not None:
        original_write = terminal_reporter.write

        def write(s, **kwargs):
            original_write(s, **kwargs)
            logger.info(s.strip())

        terminal_reporter.write = write
    else:
        logger.warning("Terminal reporter not found.")
