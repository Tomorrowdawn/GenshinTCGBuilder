import os
import subprocess
from pathlib import Path
import json
import csv
import sys

utils_path = Path(__file__).parent.absolute()
utils_path = str(utils_path)
def get_png_paths(folder_path):
    png_paths = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.png'):
            png_paths.append(os.path.join(folder_path, file_name))
    return png_paths

def run_command(commands):
    try:
        output = subprocess.run(commands)
        return output
    except subprocess.CalledProcessError as e:
        exit(1)

def scan(img_path, target_path = 'generated.json'):
    """返回扫描后的字典。注意,img_path应当是个绝对路径
    字典结构:name,characters,actions.
    characters又是一个字典,里面是name:times
    actions同理。
    """
    global utils_path
    os.chdir(utils_path+'\\'+'scanner\\python')
    target_path = utils_path + '\\' + target_path
    script_path = utils_path + '\\' + "scanner\\python\\generate_json.py"
    resources_path = '\\'.join([utils_path, 'scanner\\images'])
    command = f"cd {utils_path}\\ ;" 
    command = [sys.executable, script_path, "-q", f"{img_path}", "-r",f"{resources_path} ", "-t", f"{target_path}"]
    #print(command)
    #print("output= ")
    run_command(command)
    with open(target_path) as target:
        res = json.load(target)
    os.chdir(utils_path)
    return res

def char_id_mapping(cid_path = 'char_id.json', idc_path = 'id_char.json'):
    """读取scanner的characters_index.csv文件并据此分配id
    """
    cindex = '/'.join([utils_path, 'scanner/python','characters_index.csv'])
    with open(cindex) as cin:
        csv_reader = csv.reader(cin)
        index = [row[0] for row in csv_reader]
    mapping = {}
    idc = {}
    for i, char in enumerate(index):
        mapping[char] = i
        idc[i] = char
    with open(cid_path, 'w') as cid:
        json.dump(mapping, cid)
    with open(idc_path, 'w') as ic:
        json.dump(idc,ic)
    return mapping, idc
def action_id_mapping(aid_path = 'action_id.json',ida_path = 'id_action.json'):
    """
    读取scanner的actions_index.csv文件并据此分配id
    """
    aindex = '/'.join([utils_path, 'scanner/python','actions_index.csv'])
    with open(aindex) as ain:
        csv_reader = csv.reader(ain)
        index = [row[0] for row in csv_reader]
    mapping = {}
    ida = {}
    for i, action in enumerate(index):
        mapping[action] = i
        ida[i] = action
    with open(aid_path, 'w') as aid:
        json.dump(mapping, aid)
    with open(ida_path,'w') as ia:
        json.dump(ida,ia)
    return mapping, ida