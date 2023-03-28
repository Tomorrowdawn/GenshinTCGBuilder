from generate_json import generate
import json
from deepdiff import DeepDiff

args = {'characters_index': 'characters_index.csv',
        'actions_index': 'actions_index.csv',
        'query': '../samples/20221219214910.png',
        'result_path': '../images',
        'dimensions': '../dimensions.json',
        'name': 'AgentAyaYoi'}

parsed_data = generate(args)
with open('../samples/20221219214910.json', 'r') as f:
    expected_data = json.load(f)


assert(DeepDiff(parsed_data, expected_data) == {})