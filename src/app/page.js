'use client'

import {useState, useEffect, useRef, useCallback} from 'react'

export default function Home() {
    const [result, setResult] = useState(null);
    const [ready, setReady] = useState(null);

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
            switch (e.data.status) {
                case 'initiate':
                    setReady(false);
                    break;
                case 'ready':
                    setReady(true);
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
            <h1 className="text-5xl font-bold mb-5 text-center">Neural Search</h1>
            <h2 className="text-2xl mb-10 text-center">Edge AI</h2>

            <textarea
                className="resize w-full max-w-5xl p-4 border rounded mb-8 dark:text-black"
                placeholder="Enter text here"
                onInput={e => {
                    search(e.target.value);
                }}
            />

            {ready !== null && (
                <pre className="p-2  w-full max-w-5xl  rounded">
      {(!ready || !result) ? 'Loading...' :
          result.map((item, index) => (
              <div key={index}>
                  <div className="font-bold">{item.rank} <br/></div>
                  <div>{item.title}</div>
                  <div>{item.score}</div>
                  <hr/>
              </div>
          ))
      }
    </pre>
            )}
        </main>
    )
}