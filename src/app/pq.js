// Function to calculate the Euclidean distance between two vectors

function euclideanDistance(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must have the same dimensionality for distance calculation.');
    }
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
        sum += Math.pow(vector1[i] - vector2[i], 2);
    }
    return Math.sqrt(sum);
}


function rotate(vecs, R) { //to finish
    if (!(vecs instanceof Float32Array)) {
        throw new Error("Input vectors must be of type Float32Array");
    }
    console.log(R)
    const results = new Float32Array(vecs.length);
    for(let i = 0; i < vecs.length; i++) {
        for (let j = 0; j < R.length; j++) {
            results[i] += vecs[i] * R[j];
        }
    }
    return results;
}

function vq(obs, code_book) {
    if (!obs || !Array.isArray(obs) || obs.length === 0 || !code_book || !Array.isArray(code_book) || code_book.length === 0) {
        throw new Error('Invalid input. Both observation and code_book must be non-empty arrays.');
    }
    // Initialize variables to keep track of the closest codeword and its index
    let closestCodeWord = code_book[0];
    let closestIndex = 0;
    let minDistance = euclideanDistance(obs, closestCodeWord);

    // Iterate through the codebook to find the closest codeword
    for (let i = 1; i < code_book.length; i++) {
        const codeWord = code_book[i];
        const distance = euclideanDistance(obs, codeWord);
        if (distance < minDistance) {
            closestCodeWord = codeWord;
            closestIndex = i;
            minDistance = distance;
        }
    }
    // Return the closest codeword and its index
    return {
        codeword: closestCodeWord,
        minDistance: minDistance,
        index: closestIndex
    };
}

function  encode(vecs, codewords, Ds, M, code_dtype) {
    // Check input requirements
    if (vecs.constructor !== Float32Array) {
        throw new Error("Input vectors must be of type Float32Array.");
    }
    if (vecs.length === 0 || vecs.length % (Ds * M) !== 0) {
        throw new Error("Input dimension must be Ds * M.");
    }
    const N = vecs.length / Ds;
    // Create an empty array to store the codes
    const codes = new code_dtype(M);
    // Loop through subspaces and encode
    for (let m = 0; m < M; m++) {
        const vecs_sub = vecs.subarray(m * Ds, (m + 1) * Ds);
        const result = vq(Array.from(vecs_sub), codewords[m]);
        codes[m] = result.index;
    }
    return codes;
}

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
}

// Function to compute indices of sorted distances between a query vector and a list of vectors
function computeSortedIndicesByDistance(queryVector, vectorList) {
    const distancesWithIndices = [];
    for (let i = 0; i < vectorList.length; i++) {
        const vector = vectorList[i];
        try {
            const distance = euclideanDistance(queryVector, vector);
            distancesWithIndices.push({index: i, distance: distance});
        } catch (error) {
            console.error(`Error computing distance for vector ${i}: ${error.message} ` + vector.length + " != " + queryVector.length);
        }
    }

    // Sort the distancesWithIndices array based on distances
    distancesWithIndices.sort((a, b) => a.distance - b.distance);

    // Extract and return the sorted indices
    //const sortedIndices = distancesWithIndices.map((item) => item.index);
    //return sortedIndices;
    return distancesWithIndices;
}


async function loadBinaryFile(filePath, vectorSize) {
    try {
        // Read the binary file synchronously.
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const binaryData = await response.arrayBuffer();
        const vectors = [];
        for (let i = 0; i < binaryData.byteLength; i += vectorSize) {
            const vector = binaryData.slice(i, i + vectorSize);
            vectors.push(new Uint8Array(vector));
        }
        return vectors;
    } catch (error) {
        console.error("Error loading binary file: ", error);
        return null;
    }
}


// Function to compute indices of sorted distances between a query vector and a list of vectors
function get_indices(documents){
    const indices = documents.map(doc => doc.nb_of_embeddings);
    // Calculate cumulative sums
    for (let i = 1; i < indices.length; i++) {
      indices[i] += indices[i - 1];
    }
    return indices;
}


function feature_position_to_doc_id(distancesWithIndices, indices, max_results) {
    const doc_ids_results = {};
    const sortedIndices = distancesWithIndices.map((item) => item.index); // use dietance in a future version
    let nb_of_feats = 0;
    for (const i of sortedIndices) {
        const doc_i = binarySearch(indices, i);
        doc_ids_results[doc_i] = (doc_ids_results[doc_i] || 0) + 1;
        nb_of_feats += 1;
        if (Object.keys(doc_ids_results).length > max_results && nb_of_feats > max_results*max_results ) {
            break;
        }
    }
    return doc_ids_results;
}

function normalize(results) {
    const total = Object.values(results).reduce((acc, val) => acc + val, 0);
    const normalizedResults = {};
    for (const key in results) {
        normalizedResults[key] = results[key] / total;
    }
    return normalizedResults;
}

function enrich_metadata(sortedResults, documents) {
    const enrichedResults = [];
    sortedResults.forEach(([key, value], index) => {
        const doc = documents[key];
        enrichedResults.push({
            rank: index,
            score: value,
            ...doc
        });
    });
    return enrichedResults;
}

function search(documents, query, codewords, vectors, conf, max_results){
    const indices = get_indices(documents);
    let query_q = encode(query, codewords, conf['dim'] / conf['M'], conf['M'], Uint8Array);
    const distancesWithIndices = computeSortedIndicesByDistance(query_q, vectors);
    const results = feature_position_to_doc_id(distancesWithIndices, indices, max_results);
    const normalizedResults = normalize(results);
    var items = Object.keys(normalizedResults).map((key) => { return [key, normalizedResults[key]] });
    items.sort((first, second) => second[1] - first[1]);
    console.log(items);
    return enrich_metadata(items, documents);

}

export { search, loadBinaryFile };
