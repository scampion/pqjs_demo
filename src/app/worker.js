import { pipeline, env } from "@xenova/transformers";
import {loadBinaryFile, encode, computeSortedIndices, binarySearch, get_indices, search} from './pq';

let response;
response = await fetch('/documents.json');
const documents = await response.json();

response = await fetch('/codewords.json');
const codewords = await response.json();

response = await fetch('/conf.json');
const conf = await response.json();

const vectors = await loadBinaryFile("/pq.bin", conf['M']);

// const model_name = conf['model'].split('/')[1];
// const model = 'Xenova/' + model_name;
//
// let pp = await pipeline('feature-extraction', model);
// let query = "Audiovisual rights in sports events"; // 599320
//
// console.log("Query: " + query);
//
// let observation = await pp(query, {pooling: "mean", quantized: true, normalize: true});
//
// const results = search(documents, observation.data, codewords, vectors, conf, 5);
// console.log(JSON.stringify(results, null, 2));




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
    const results = search(documents, output.data, codewords, vectors, conf, 5);
    console.log(JSON.stringify(results.length, null, 2));
    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: results,
    });
});

