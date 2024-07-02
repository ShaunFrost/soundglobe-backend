const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8080
const cors = require('cors')
const dotenv = require('dotenv')
const { createSHA256Hash, getImageBuffer } = require('./utils')
const ImageKit = require("imagekit")

require('dotenv').config()

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const generatedImages = {}

app.use(bodyParser.json())
app.use(cors())

app.post('/create', async (req, res) => {
    const { email, imageData } = req.body
    const imageId = createSHA256Hash(email)
    const imageBuffer = getImageBuffer(imageData)
    const resp = await imagekit.upload({
        file: imageBuffer,
        fileName: imageId + '.jpeg',
        useUniqueFileName: false
    })
    generatedImages[imageId] = resp.url
    res.json({
        success: true,
        id: imageId,
    })
})

app.get('/', (req, res) => {
    res.send('<h1>Server is on</h1>')
})

app.get('/image/:imageId', (req, res) => {
    const { imageId } = req.params;
    const imageUrl = generatedImages[imageId];
    if (imageUrl) {
        const thumbnailUrl = imagekit.url({
            src: imageUrl,
            transformation: [{
                width: 200,
                height: 200,
                quality: 75
            }]
        });
        res.send(`
            <html>
                <head>
                    <meta name="twitter:card" content="summary">
                    <meta name="twitter:title" content="My favorite artist country">
                    <meta name="twitter:description" content="Map representation of the country of my most listened artists">
                    <meta name="twitter:image" content="${thumbnailUrl}">
                </head>
                <body>
                    <img src="${imageUrl}" />
                </body>
            </html>
        `)
    } else {
        res.status(404).send('Image not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});