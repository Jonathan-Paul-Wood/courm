export function downloadContent(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
//example: downloadContent(jsonData, 'json.txt', 'text/plain');

export function exportJSON(json, name) {
    const time = new Date();
    const data = {
        version: 'beta',
        total: json.length,
        timestamp: time.toISOString(),
        data: json,
    }
    const content = JSON.stringify(data);
    downloadContent(content, `${name}_${time.toISOString().replace(/\:/g, '-')}.json`, 'text/json')
}