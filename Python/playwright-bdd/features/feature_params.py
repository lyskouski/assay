import json
import os

def get_config_param(path, env=None):
    parts = path.split('.')
    key = parts[-1]
    config_path = '/'.join(parts[:-1]) + '.json'

    if not os.path.isfile(config_path):
        raise FileNotFoundError(f"The JSON file '{config_path}' does not exist")
    
    with open(config_path, 'r', encoding='utf-8') as json_file:
        config_data = json.load(json_file)
    
    if key not in config_data:
        raise KeyError(f"The key '{key}' does not exist in the JSON file '{config_path}'")
    
    result = config_data[key]

    # If the result is a dictionary, get value based on "env" argument or the first
    if isinstance(result, dict):
        if env and env in result:
            result = result[env]
        else:
            first_key = next(iter(result))
            result = result[first_key]

    return result
