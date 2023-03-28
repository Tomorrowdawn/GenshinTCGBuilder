export interface IndexData {
    name: string,
    data: Float32Array
}

export class Search {

    indexData: IndexData[];

    /**
     * @param indexData Array of IndexData objects each with the name of a card and its respective features as a Float32Array object
     */
    constructor(indexData: IndexData[]) {
        this.indexData = indexData;
    }
    /**
     * Calculate dissimilarity of a card to all items in the indexData using Chi-Squared Distance. A number of results (limit) are returned with its ID and distance value
     * @param queryFeatures Float32Array object containing histogram features of the image to lookup
     * @param limit Number of search results to return
     * @returns Array of search results in pairs of index ID and distance value
     */
    search(queryFeatures: Float32Array, limit: number = 10): [string, number][]{
        // Calculate distance for card in query to all possible cards
        let distances: [string, number][] = [];
        for (let entry of this.indexData) {
            let d = this.chi2Distance(entry.data, queryFeatures);
            distances.push([entry.name, d]);
        }
        // Sort by smallest distance == least dissimilarity
        let results = distances.sort(([, a], [, b]) => a - b);
        return results.slice(0, limit);
    }

    /**
     * Calculate Chi-Squared Distance Metric between two arrays containing histogram values.
     * See "Chi-Squared Distance Metric Learning for Histogram Data" (https://doi.org/10.1155/2015/352849)
     * @param histA Float32Array object of first histogram
     * @param histB Float32Array object of second histogram
     * @param eps epsilon value to prevent divide by zero. Defaults to 1e-10
     * @returns Chi-Squared Distance of both histogram arrays
     */
    chi2Distance(histA: Float32Array, histB: Float32Array, eps = 1e-10) {
        return histA.map((a, i) => {
            let b = histB[i];
            return ((a - b) ** 2 / (a + b + eps))
        }).reduce((a, b) => a + b, 0);
    }

}