import requests
from json.decoder import JSONDecodeError
from typing import Dict, Any
from features.feature_params import get_config_param

class JiraRequests:
    def __init__(self, test_cycle_name):
        self.test_cycle_name = test_cycle_name
        self._session = requests.Session()
        self._session.headers.update({
            "Accept": "application/json", 
            "Content-type": "application/json",
            "Authorization": f"Bearer {get_config_param('configs._secured.zephyr.access_token')}"
        })

    def _request_handler(
        self, method: str, api_endpoint: str, json: Any = None, params: Dict[str, Any] = None, timeout: int = 30
    ) -> requests.Response:
        request_url = f"{get_config_param('configs._secured.zephyr.jira_base_url')}/{api_endpoint}"
        response = self._session.request(method, request_url, json=json, params=params, timeout=timeout)
        if not response.ok:
            error_log_message = f"{method} '{request_url}' request failed, received {response.status_code} error"
            potential_error_keys = ("errorMessage", "errorMessages", "message")
            try:
                for key in potential_error_keys:
                    if key in response.json():
                        error_messages = response.json()[key]
                        if isinstance(error_messages, str):
                            error_messages = [error_messages]
                        for error_message in error_messages:
                            error_log_message += f", {error_message}"
            except JSONDecodeError:
                error_log_message = (
                    f"Failed to decode request json response, response status code: {response.status_code}"
                )
            raise Exception(error_log_message)   
        return response

    def _create_test_result(self, test_case_key, status, execution_time, comment) -> None:
        payload = {
            "projectKey": get_config_param('configs._secured.zephyr.jira_project_key'),
            "testCycleKey": get_config_param('configs._secured.zephyr.test_cycle_key', self.test_cycle_name),
            "testCaseKey": test_case_key,
            "statusName": status,
            "executionTime": execution_time,
            "comment": comment,
        }
        try:
            self._request_handler("POST", "testexecutions", payload, payload)
        except Exception as e:
            Exception(f"Failed to create: {e}")

    def set_skipped(self, test_case_key, reason) -> None:
        self._create_test_result(test_case_key, "Blocked", None, reason)

    def set_passed(self, test_case_key) -> None:
        self._create_test_result(test_case_key, "Pass", None, "")

    def set_failed(self, test_case_key, reason) -> None:
        self._create_test_result(test_case_key, "Fail", None, reason)