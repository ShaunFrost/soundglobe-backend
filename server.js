const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8080
const cors = require('cors')

const generatedImages = {abc: 'abc'}

app.use(bodyParser.json())
app.use(cors())

app.post('/create', (req, res) => {
    const { imageId, imageData } = req.body
    generatedImages[imageId] = imageData
    res.json({
        success: true,
        url: req.url
    })
})

app.get('/', (req, res) => {
    res.send('<h1>Server is on</h1>')
})

app.get('/image/:imageId', (req, res) => {
    const { imageId } = req.params;
    const data = generatedImages[imageId];
    if (data) {
        // res.json({data})
        res.send(`<html>
            <head>
                <meta name="twitter:image" content="${data}" />
            </head>
            <body>
            <img src="${data}">
            </body>
        </html>`);
    } else {
        res.status(404).send('Image not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});