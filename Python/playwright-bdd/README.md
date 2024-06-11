# BCDR Automation


## Getting started

Create a Virtual Environment:

```sh
pip install --upgrade pip setuptools normalizer
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install dependencies (Playwright, Pytest, etc.):

```sh
pip install -r requirements.txt
```

Install Playwright Browsers: 

```sh
python -m playwright install
```

Run Health Check:
```sh
# Expectation: 1 failed (AssertionError), 3 passed 
python -m pytest -s -v tests/test_sample.py
python -m pytest --headless -v tests/test_sample.py
# Expectation: 3 failed (AssertionError, ERR_CONNECTION_REFUSED), 1 passed 
python -m pytest --headless --env local -v tests/test_sample.py
# Expectation: 4 passed, 4 parallel executions, report generated
python -m pytest --html=reports/result.html --numprocesses 4 --env stage -v tests/test_sample.py
# Expectation: 1 passed, 4 deselected
python -m pytest --headless --env stage -m only
```

Details:
- `-s` is used to plot BDD notation
- `--headless` run browser in headless mode

## Directory Structure

- tests/: Main directory for storing all test cases.
    - projectA/: Contains tests specific to Project A.
    - projectB/: Contains tests specific to Project B.
    - ...: ...

- configs/: 
    Configuration files for different projects. These can be JSON, YAML, or any format that suits your needs, 
    containing environment-specific configurations, credentials, or other settings.

- features/:
    Unified BDD functionality across projects (open browser, operate with inputs and selectors, etc.).

- fixtures/: 
    Pytest fixture files specific to different projects, providing setup and teardown functionality.

- reports/: 
    Directory to store test reports.

- requirements.txt: 
    Lists of Python dependencies required to run the tests.

- pytest.ini: Configuration file for pytest, allowing to set various pytest options and configurations.
