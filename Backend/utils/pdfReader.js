const fs = require("fs");
const pdf = require("pdf-parse-fixed");

async function readPdfText(filePath) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;
}

module.exports = readPdfText;
