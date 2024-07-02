const crypto = require('crypto')

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

function getImageBuffer(imageData) {
    const commaIndex = imageData.indexOf(',')
    const base64Data = imageData.substr(commaIndex + 1)
    return Buffer.from(base64Data, 'base64')
}

module.exports = {
    createSHA256Hash,
    getImageBuffer
}