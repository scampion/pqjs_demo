
import { pipeline, env } from "@xenova/transformers";

import conf from "./data/conf.json";


import { loadBinaryFile, encode, computeSortedIndices, binarySearch } from './pq';

//import documents from "./data/documents.json";
let response = await fetch('/documents.json');
const documents = await response.json();
const indices = documents.map(doc => doc.nb_of_embeddings);

// Calculate cumulative sums
for (let i = 1; i < indices.length; i++) {
  indices[i] += indices[i - 1];
}
console.log(indices);

response = await fetch('/codewords.json');
const codewords = await response.json();
console.log(codewords);

const vectors = await loadBinaryFile("/pq.bin", conf['M']);
const model_name = conf['model'].split('/')[1];
const model = 'Xenova/' + model_name;
let pp = await pipeline('feature-extraction', model);
let query = "Audiovisual rights in sports events"; // 599320
console.log("Query: " + query);

let observation = await pp(query, {pooling: "mean", quantized: true, normalize: true});

let result = encode(observation.data, codewords, conf['dim'] / conf['M'], conf['M'], Uint8Array);
console.log(result);

const sortedIndices = computeSortedIndices(result, vectors);

const results = {};
const max_results = 5;

for (const i of sortedIndices) {
  const doc_i = binarySearch(indices, i);
  results[doc_i] = (results[doc_i] || 0) + 1;
  if (Object.keys(results).length > max_results) {
    break;
  }
}

const total = Object.values(results).reduce((acc, val) => acc + val, 0);
const normalizedResults = {};
for (const key in results) {
  normalizedResults[key] = results[key] / total;
}

// Sort results by value (score)
const sortedResults = Object.fromEntries(
  Object.entries(normalizedResults).sort((a, b) => b[1] - a[1])
);

const enrichedResults = [];
Object.entries(sortedResults).forEach(([key, value], index) => {
  const doc = documents[key];
  enrichedResults.push({
    rank: index,
    score: value,
    ...doc
  });
});

console.log(JSON.stringify(enrichedResults, null, 2));




// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/' + conf['model'].split('/')[1];
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the classification pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let extractor = await PipelineSingleton.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    // Actually perform the classification
    let output = await extractor(event.data.text, { pooling: 'mean', normalize: true });
    console.log(output);

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output.data,
    });
});

