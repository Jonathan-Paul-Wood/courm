export function deepCopy (json) {
    return JSON.parse(JSON.stringify(json));
}

export function isJSONEqual (jsonA, jsonB) {
    return JSON.stringify(jsonA) === JSON.stringify(jsonB);
}
