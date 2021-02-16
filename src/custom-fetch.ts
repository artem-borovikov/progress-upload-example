export function customFetch(url: string, opts: any = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(opts.method || 'get', url)

        for (let k in opts.headers || {}) xhr.setRequestHeader(k, opts.headers[k])

        xhr.onload = (e: any) =>
            resolve({
                ok: true,
                text: () => Promise.resolve(e.target.responseText),
                json: () => Promise.resolve(JSON.parse(e.target.responseText)),
            })

        xhr.onerror = reject

        if (xhr.upload) {
            xhr.upload.onprogress = opts.onProgress;
        }

        xhr.send(opts.body)
    })
}
