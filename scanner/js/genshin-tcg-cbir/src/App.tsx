import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { Search } from './utils/searcher';
import { parseCards } from './utils/cardutils';
import cv from 'opencv-ts';

import cardsIndex from './utils/cards-index.json';

interface Deck {
  name: string
  characters: {
    [id: string]: number
  },
  actions: {
    [id: string]: number
  }
}

const GenshinTCGImporter: React.FC<{}> = () => {
  const [deckName, setDeckName] = useState<string>("My Deck");
  const [deck, setDeck] = useState<Deck>();
  const [deckText, setDeckText] = useState<string>("Select a deck image to scan!");
  const [deckImageURL, setDeckImageURL] = useState<string>("");

  useEffect(() => { console.log(deck) }, [deck]);

  const characterSearcher = new Search(cardsIndex.characters.map(
    (v) => ({ "name": v.name, "data": new Float32Array(v.data) }
    )));
  const actionsSearcher = new Search(cardsIndex.actions.map(
    (v) => ({ "name": v.name, "data": new Float32Array(v.data) }
    )))

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }
    const file = files[0]
    const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!acceptedFileTypes.includes(file.type)) {
      let err = new TypeError(`Accepted input filetypes are PNG, JPG, WEBP, and GIF! Got ${file.type} instead.`);
      console.error(err);
      setDeckText(err.message);
      return;
    }
    setDeckImageURL(URL.createObjectURL(file));
  }

  const handleImageLoad = () => {
    console.log("Image loaded!");
    let queryMat = cv.imread('uploaded-image');

    if (characterSearcher && actionsSearcher) {
      try {
        let [characters, actions] = parseCards(queryMat, characterSearcher, actionsSearcher);
        let newDeck = { name: deckName, characters: characters, actions: actions };
        setDeck(newDeck);
        setDeckText(JSON.stringify(newDeck));
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setDeckText(err.message);
        }
      }
    }
  }

  return (
    <>
      <label>Deck name:</label> <input id="deckname" type="text" defaultValue={deckName} onChange={(e) => setDeckName(e.target.value)} style={{margin: '2em'}} />
      <br />
      <input id="file" type="file" onChange={handleFileChange} />
      <br />
      {deck
      ? <img id="image-preview" src={deckImageURL} alt="" width={'600px'} height={'815px'} style={{padding: '2em'}}/> 
      : <img id="instructions" src={`${process.env.PUBLIC_URL}/share-deck.gif`} alt="" style={{padding: '2em'}}/>
      }
      
      <br />
      <textarea readOnly value={deckText} style={{ width: '50%', height: '12em' }}></textarea>
      <br />
      <button onClick={() => navigator.clipboard.writeText(deckText)}>Copy</button>

      {/* Dummy image to load in opencv */}
      <img id="uploaded-image" src={deckImageURL} alt="" onLoad={handleImageLoad} style={{ display: 'none' }} />

    </>
  )

}

function App() {
  return (
    <div className="App">
      <div>
        <GenshinTCGImporter />
      </div>
    </div>
  );
}

export default App;
