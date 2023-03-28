import cv2
import argparse
import glob
from colordescriptor import ColorDescriptor
import csv
import json

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", required = True,
    help = "Path to the directory that contains the images to be indexed")
ap.add_argument("-i", "--index", required = True,
    help = "Path to where the computed index will be stored")
# ap.add_argument("-t", "--type", required = False, default = "csv",
#     help = "json or csv. Defaults to csv")
args = vars(ap.parse_args())
# initialize the color descriptor
cd = ColorDescriptor((8, 12, 3))

# open the output index file for writing
# if args["type"] == 'csv':
with open(args["index"], "w", newline='') as f:
    writer = csv.writer(f)
    # use glob to grab the image paths and loop over them
    for imagePath in glob.glob(args["dataset"] + "/*.png"):
        # extract the image ID (i.e. the unique filename) from the image
        # path and load the image itself
        imageID = imagePath[max(imagePath.rfind("/"), imagePath.rfind("\\")) + 1: -4]
        image = cv2.imread(imagePath)
        # describe the image
        features = cd.describe(image)
        # write the features to file
        row = [imageID] + [str(f) for f in features]
        writer.writerow(row)
# elif args["type"] == 'json':
#     results = []
#     for imagePath in glob.glob(args["dataset"] + "/*.png"):
#         entry = {}
#         entry["name"] = imagePath[max(imagePath.rfind("/"), imagePath.rfind("\\")) + 1: -4]
#         image = cv2.imread(imagePath)
#         features = cd.describe(image)
#         entry["data"] = list(map(float, features))
#         results.append(entry)
#     with open(args["index"], "w") as f:
#         results_json = json.dumps(results)
#         f.write(results_json)
# else:
#     raise NotImplementedError(f"{args['type']} is not an accepted format!")


