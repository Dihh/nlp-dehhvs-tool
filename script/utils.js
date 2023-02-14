export function uuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export function getUrlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return Object.fromEntries(urlParams)
}

export function readFileContent(element) {
    return new Promise((resolve, reject) => {
        var file = element.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                resolve(evt.target.result)
            }
            reader.onerror = function (evt) {
                reject()
            }
        }
    })
}

export function csvJSON(text, quoteChar = '"', delimiter = ',') {
    text = text.split('""').join('')
    var rows = text.split("\n");
    var headers = rows[0].split(",");

    const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');

    const match = line => [...line.matchAll(regex)]
        .map(m => m[2])
        .slice(0, -1);

    var lines = text.split('\n');
    const heads = headers ?? match(lines.shift());
    lines = lines.slice(1);
    lines = lines.map(line => {
        return match(line).reduce((acc, cur, i) => {
            // replace blank matches with `null`
            const val = cur.length <= 0 ? null : Number(cur) || cur;
            const key = heads[i] ?? `{i}`;
            return { ...acc, [key]: val };
        }, {});
    });
    return { lines, headers: heads }
}

export const PATH = 'nlp-dehhvs-tool/'
// export const PATH = './'