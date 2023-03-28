# Generates in json format the deck

import json
import cv2
import argparse
from colordescriptor import ColorDescriptor
from searcher import Searcher
import time


def search_card(img, cd, searcher):
    """_summary_

    Args:
        img (_type_): _description_
        cd (_type_): _description_
        searcher (_type_): _description_

    Returns:
        _type_: _description_
    """
    features = cd.describe(img)
    results = searcher.search(features, 1)

    return results[0][1]


def crop_card(img, x, y, w, h):
    """

    Args:
        img (_type_): _description_
        x (_type_): _description_
        y (_type_): _description_
        w (_type_): _description_
        h (_type_): _description_

    Returns:
        _type_: _description_
    """
    return img[y:y+h, x:x+w]


def generate(args):
    wts = time.time()
    ets = time.process_time()

    # stores coordinates of the top-left corner of each card on the image and their sizes
    with open(args["dimensions"], 'r') as dim_json:
        DIMENSIONS = json.load(dim_json)

    char_searcher = Searcher(args["characters_index"])
    act_searcher = Searcher(args["actions_index"])

    cd = ColorDescriptor((8, 12, 3))
    query_img = cv2.imread(args["query"])

    char_pos = DIMENSIONS['characters']['pos']
    char_h, char_w = (DIMENSIONS['characters']['h'],
                      DIMENSIONS['characters']['w'])
    act_pos = DIMENSIONS['actions']['pos']
    act_h, act_w = (DIMENSIONS['actions']['h'], DIMENSIONS['actions']['w'])

    characters = {}
    actions = {}

    for pos in char_pos:
        img_card = crop_card(query_img, pos[0], pos[1], char_w, char_h)
        card_id = search_card(img_card, cd, char_searcher)
        characters[card_id] = 1
        # don't care about number of blank cards
        # cv2.imshow(card_id, img_card)
        # cv2.waitKey(0)

    for pos in act_pos:
        img_card = crop_card(query_img, pos[0], pos[1], act_w, act_h)
        card_id = search_card(img_card, cd, act_searcher)
        if card_id in actions:
            actions[card_id] += 1
        else:
            actions[card_id] = 1
        # cv2.imshow(card_id, img_card)
        # cv2.waitKey(0)

    result = {
        "name": str(args['name']),
        "characters": characters,
        "actions": actions
    }
    result_json = json.dumps(result)

    wte = time.time()
    ete = time.process_time()

    print(f"Time elapsed: {wte-wts}")
    print(f"Execution time: {ete-ets}")
    print(result)

    with open(args['target'], 'w') as f:
        f.write(result_json)
    return result


if __name__ == '__main__':
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-ci", "--characters-index", required=False, default="characters_index.csv",
                    help="Path to characters index")
    ap.add_argument("-ai", "--actions-index", required=False, default="actions_index.csv",
                    help="Path to action index")
    ap.add_argument("-q", "--query", required=True,
                    help="Path to the query image")
    ap.add_argument("-r", "--result-path", required=True,
                    help="Path to the result path")
    ap.add_argument("-d", "--dimensions", required=False, default="../dimensions.json",
                    help="Path to the dimensions.json file")
    ap.add_argument("-n", "--name", required=False, default="My Deck",
                    help="Name of deck")
    ap.add_argument("-t", "--target", required=False, default="generated.json",help="Name of deck")
    args = vars(ap.parse_args())
    print('args:', args)
    generate(args)
