export function downloadContent (content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
// example: downloadContent(jsonData, 'json.txt', 'text/plain');

export function exportContactList (array, name) {
    exportJSON({
        contacts: {
            total: array.length,
            data: array
        }
    },
    name
    );
}

export function exportJSON (json, name) {
    const time = new Date();
    const data = {
        version: 2,
        timestamp: time.toISOString(),
        data: json
    };
    const content = JSON.stringify(data);
    downloadContent(content, `${name}_${time.toISOString().replace(/:/g, '-')}.json`, 'text/json');
}
