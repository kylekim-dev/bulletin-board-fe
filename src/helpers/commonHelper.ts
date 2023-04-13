export const downloadJsonFile = (json: string) => {
    const { v4: uuidv4 } = require('uuid');
    const a = document.createElement("a");
    const file = new Blob([json], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = uuidv4() + ".json";
    a.click();
}

export const deepCopy = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
}

export const isNullOrEmpty = (value: any) => {
    return value === undefined || value === null || value === "";
}