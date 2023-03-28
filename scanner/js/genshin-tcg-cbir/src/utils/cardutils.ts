import cv, { Mat } from "opencv-ts";
import { ColorDescriptor } from "./colordescriptor";
import { Search } from "./searcher";

import Dims from "./dimensions.json";

/**
 * 
 * @param image cv.Mat object of a single card
 * @param cd ColorDescriptor object
 * @param search Search object with corresponding index files
 * @returns the name of the card
 */
function searchCard(image: Mat, cd: ColorDescriptor, search: Search): string {
    // Describe each card and pick best match only
    let features = cd.describeImage(image);
    let results = search.search(features, 1);
    return results[0][0];
}
/**
 * Crop card according to size
 * @param image cv.Mat object of the image matrix
 * @param x X-coordinate in the image from top-left corner
 * @param y Y-coordinate in the image from top-left corner
 * @param w card width
 * @param h card height
 * @returns cv.Mat object containing the sub-matrix of the cropped section of the card
 */
function cropCard(image: Mat, x: number, y: number, w: number, h: number): Mat {
    let rect = new cv.Rect(x, y, w, h);
    let dst = new cv.Mat();
    dst = image.roi(rect);
    return dst;
}

/**
 * 
 * @param queryImage cv.Mat object of the whole screenshot image
 * @param characterSearcher Search object with character cards index
 * @param actionsSearcher Search object with action cards index
 * @returns `[{[id: string]: number}, {[id: string]: number}]` --
 * The first item contains the character cards identified, the second item contains the action cards identified. 
 * There should be 3 character cards and 30 action cards identified.
 */
export function parseCards(queryImage: Mat, characterSearcher: Search, actionsSearcher: Search): [{ [id: string]: number }, { [id: string]: number }] {
    // Check image size
    let h = queryImage.size().height;
    let w = queryImage.size().width;
    if (h !== 1630) {
        throw new RangeError(`Image height must be exactly 1630px! Input image height was ${h} px.`);
    }
    if (w !== 1200) {
        throw new RangeError(`Image width must be exactly 1200px! Input image height was ${w} px.`);
    }

    const cd = new ColorDescriptor([8, 12, 3]);
    let characters: { [id: string]: number } = {};
    let actions: { [id: string]: number } = {};

    // Determine card name for each card
    for (let charPos of Dims.characters.pos) {
        let cardImage = cropCard(queryImage, charPos[0], charPos[1], Dims.characters.w, Dims.characters.h);
        let cardId = searchCard(cardImage, cd, characterSearcher);
        characters[cardId] = 1;
        cardImage.delete();
    }
    console.debug('characters', characters);
    for (let actPos of Dims.actions.pos) {
        let cardImage = cropCard(queryImage, actPos[0], actPos[1], Dims.actions.w, Dims.actions.h);
        let cardId = searchCard(cardImage, cd, actionsSearcher);
        if (cardId in actions)
            actions[cardId] += 1;
        else
            actions[cardId] = 1;
        cardImage.delete();
    }
    console.debug('actions', actions);

    return [characters, actions];
}