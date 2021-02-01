export function downloadContent(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
//example: downloadContent(jsonData, 'json.txt', 'text/plain');

export function exportJSON(json, name) {
    const content = JSON.stringify(json);
    const time = new Date();
    downloadContent(content, `${name}_${time.toISOString().replace(/\:/g, '-')}.json`, 'text/json')
}