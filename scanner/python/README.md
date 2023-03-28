# Using Python3

Python implementation of CBIR to lookup card images in database

Work based on https://pyimagesearch.com/2014/12/01/complete-guide-building-image-search-engine-python-opencv/

## Usage

1. Create environment in conda

   ```sh
   conda env create -f environment.yml
   conda activate genshin-tcg
   ```

2. Generate indexes for character and action cards containing card features:

    ```sh
    python indexer.py --dataset ../images/characters --index characters_index.csv
    python indexer.py --dataset ../images/actions --index actions_index.csv
    ```

3. Reading single card images and searching from index:

    ```sh
    python search.py --index characters_index.csv --query ../samples/xiangling-test.png --result-path ../images/characters
    python search.py --index actions_index.csv --query ../samples/paimon-test.png --result-path ../images/actions
    ```

4. Reading "Deck Preview" image generated in Genshin Impact and generate dictionary in json format

    ```sh
    python generate_json.py -q ../samples/20221219214910.png -r ../images
    ```
