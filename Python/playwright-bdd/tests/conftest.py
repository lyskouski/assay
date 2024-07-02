import logging
import os
import re
import sys
from fixtures.fixture_base import *
from reports.zephyr_report import *

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Recognize 'env' variable from console
ENV_VARIABLE = '_env'
for i, arg in enumerate(sys.argv):
    if arg == '--env' and i + 1 < len(sys.argv):
        os.environ[ENV_VARIABLE] = sys.argv[i + 1]

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
    env = os.environ.get(ENV_VARIABLE)
    # @todo: /{test-cycle-name}/ [{test-case-name}] {reason details}
    if tag.startswith("todo"):
        marker = pytest.mark.skip(reason="Not implemented yet")
        marker(function)
        match = re.search(r'/(.*?)/ \[([A-Z]+-[^\]]+)\]', tag)
        if match:
            zephyr = JiraRequests(match.group(1))
            zephyr.set_skipped(match.group(2), tag)
        return True
    # @skip-stage @skip-local
    elif tag == f'skip-{env}':
        marker = pytest.mark.skip(reason=f"Skipped in {env} environment")
        marker(function)
        return True
    else:
        # Fall back to the default behavior of pytest-bdd
        return None

# Plot failed BDD notation
def pytest_bdd_step_error(request, feature, scenario, step, step_func, step_func_args, exception):
    logger.info(f"\n\n[FAILED] Scenario: {scenario.name}\n         Step: {step.keyword} {step.name}\n         Error: {exception}\n\n")

def pytest_bdd_after_scenario(request, feature, scenario):
    rep = request.node.rep_call
    match = re.search(r'\[([A-Z]+-[^\]]+)\]', scenario.name)
    if match:
        test_case = match.group(1)
        test_cycle_name = rep.nodeid.split('/')[1]
        zephyr = JiraRequests(test_cycle_name)
        report = request.node.__scenario_report__.serialize()
        failed_steps = [step['name'] for step in report['steps'] if step['failed']]
        if len(failed_steps) == 0:
            zephyr.set_passed(test_case)
        else:
            zephyr.set_failed(test_case, f"Failed for '{os.environ.get(ENV_VARIABLE)}' env, check the latest build")

# Add a pytest hook to print to the terminal directly
@pytest.hookimpl(trylast=True)
def pytest_report_header(config):
    terminal_reporter = config.pluginmanager.getplugin('terminalreporter')
    if terminal_reporter is not None:
        original_write = terminal_reporter.write

        def write(s, **kwargs):
            original_write(s, **kwargs)

        terminal_reporter.write = write
    else:
        logger.warning("Terminal reporter not found.")
