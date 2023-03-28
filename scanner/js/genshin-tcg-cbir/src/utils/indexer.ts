// Run with "npm run index"

import glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import cv from 'opencv-ts';
import { ColorDescriptor } from './colordescriptor';
const { getSync } = require('@andreekeberg/imagedata');

async function onRuntimeInitialized() {
    console.log('OpenCV Ready');

    const charactersPath = "../../images/characters/";
    const actionsPath = "../../images/actions/";
    const indexFilename = "src/utils/cards-index.json";

    // Check images to index. Assume all images are PNG files.
    const characters: string[] = glob.sync('*.png', { cwd: charactersPath });
    const actions: string[] = glob.sync('*.png', { cwd: actionsPath });
    console.log(`Found ${characters.length} character cards in ${charactersPath}`);
    console.log(`Found ${actions.length} action cards in ${actionsPath}`);

    // Generate features
    const cd = new ColorDescriptor([8, 12, 3]);

    let charactersIndex: { name: string, data: Float32Array }[] = [];
    for (let characterFile of characters) {
        let imageId = characterFile.substring(0, characterFile.length - 4);
        // Read image into fs
        let imageFile = fs.readFileSync(path.join(charactersPath, characterFile));
        // Convert image in fs to ImageData object
        let imageData = getSync(imageFile) as ImageData;
        // Now we can run OpenCV without reading from a DOM
        let imageMat = cv.matFromImageData(imageData);
        let features = cd.describeImage(imageMat);
        imageMat.delete();
        charactersIndex.push({ name: imageId, data: features });
    }

    let actionsIndex: { name: string, data: Float32Array }[] = [];
    for (let actionFile of actions) {
        let imageId = actionFile.substring(0, actionFile.length - 4);
        let imageFile = fs.readFileSync(path.join(actionsPath, actionFile));
        let imageData = getSync(imageFile);
        let imageMat = cv.matFromImageData(imageData);
        let features = cd.describeImage(imageMat);
        imageMat.delete();
        actionsIndex.push({ name: imageId, data: features });
    }

    console.log(`Generated features for ${charactersIndex.length} character cards.`);
    console.log(`Generated features for ${actionsIndex.length} action cards.`);

    // Save index
    let cardsIndexJson = JSON.stringify({
        "characters": charactersIndex,
        "actions": actionsIndex
    },
        (k, v) => ArrayBuffer.isView(v) ? Array.from(v as unknown as ArrayLike<unknown>) : v, 2);
    try {
        fs.writeFileSync(indexFilename, cardsIndexJson);
        console.log(`Saved index data to ${indexFilename}`);
    } catch (err) {
        console.error(err);
    }
}

// Set above function to run only after OpenCV is initialized.
cv.onRuntimeInitialized = onRuntimeInitialized;

export { };