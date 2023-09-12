'use client'

import {useState, useEffect, useRef, useCallback} from 'react'


function htmlToElement(html) {
    // https://stackoverflow.com/a/35385518
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function formatBytes(bytes, decimals = 0) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)), 10);
    const rounded = (bytes / Math.pow(1000, i)).toFixed(decimals);
    return rounded + " " + sizes[i];
}

export default function Home() {
    const [result, setResult] = useState(null);
    const [ready, setReady] = useState(null);

    const [metadata, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/metadata.json')
            .then((res) => res.json())
            .then((metadata) => {
                setData(metadata)
                setLoading(false)
            })
    }, [])

    // Create a reference to the worker object.
    const worker = useRef(null);

    // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
    useEffect(() => {
        if (!worker.current) {
            // Create the worker if it does not yet exist.
            worker.current = new Worker(new URL('./worker.js', import.meta.url), {
                type: 'module'
            });
        }

        // Create a callback function for messages from the worker thread.
        const onMessageReceived = (e) => {
            const PROGRESS = document.getElementById('progress');
            const PROGRESS_BARS = document.getElementById('progress-bars');

            switch (e.data.status) {
                case 'initiate':
                    setReady(false);
                    if (e.data.file) {
                        PROGRESS.classList.remove('hidden');
                        PROGRESS_BARS.appendChild(htmlToElement(`
                                <div class="progress w-100" model="${e.data.name}" file="${e.data.file}">
                                    <div class="progress-bar" role="progressbar"></div>
                                </div>
                            `));
                    }
                    break;
                case 'progress':
                    let bar = PROGRESS_BARS.querySelector(`.progress[model="${e.data.name}"][file="${e.data.file}"]> .progress-bar`)
                    bar.style.width = e.data.progress.toFixed(2) + '%';
                    bar.textContent = `${e.data.file} (${formatBytes(e.data.loaded)} / ${formatBytes(e.data.total)})`;
                    break;
                case 'ready':
                    setReady(true);
                    break;
                case 'done':
                    if (e.data.file) {
                        let bar = PROGRESS_BARS.querySelector(`.progress[model="${e.data.name}"][file="${e.data.file}"]> .progress-bar`)
                        bar.parentElement.remove();
                    }
                    // if no more files to load, hide progress bar
                    if (PROGRESS_BARS.children.length === 0) {
                        PROGRESS.classList.add('hidden');
                    }
                    break;
                case 'complete':
                    setResult(e.data.output)
                    break;
            }
        };

        // Attach the callback function as an event listener.
        worker.current.addEventListener('message', onMessageReceived);
        // Define a cleanup function for when the component is unmounted.
        return () => worker.current.removeEventListener('message', onMessageReceived);
    });

    const search = useCallback((text) => {
        if (worker.current) {
            worker.current.postMessage({text});
        }
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-12">
            <h1 className="text-5xl font-bold mb-5 text-center">PQ JS</h1>
            <h2 className="text-2xl mb-10 text-center">Transformer-based Embedding Retrieval with Product Quantization
                for Edge Computing</h2>
            Enter a text to search for similar documents (~ 100 characters)
            <div id="progress" className="col-12 mt-4 w-full hidden">
                <div className="d-flex align-items-center position-relative py-2">
                    <div><strong>Loading model files...</strong> (only run once)</div>
                    <div className="spinner-border position-absolute" role="status" aria-hidden="true">
                    </div>
                </div>

                <div id="progress-bars" className="d-flex justify-content-center flex-column gap-2 py-2"></div>
            </div>


            <textarea
                className="resize w-full max-w-5xl p-4 border rounded mb-8 dark:text-black"
                placeholder="Enter text here"
                onInput={e => {
                    search(e.target.value);
                }}
            />

            {ready !== null && (
                <div className="p-2  w-full max-w-5xl  rounded">
                    <ul className="list-decimal">
                    {(!ready || !result) ? 'Loading...' :
                        result.map((item, index) => (
                            <li className="text-xl">
                                <a href={item.url}>{item.title}</a><br/>
                            </li>

                        ))
                    }
</ul>
    </div>
            )}
            {(!ready || !result) ? '' :
                (<div className="text-xs text-left ">
                    <br/>
                    <div>Execution query time: {Math.floor(result.time)} milliseconds</div>
                </div>)
            }
            <hr/>
            <div className="text-xs text-center">
                {(isLoading) ? 'Loading...' :
                    (<div className="text-xs text-left ">
                        <div>Number of documents: {metadata.nb_of_documents}</div>
                        <div>Number of vectors: {metadata.nb_of_embeddings.toLocaleString("en-US")}</div>
                    </div>)

                }
            </div>
        </main>
    )
}