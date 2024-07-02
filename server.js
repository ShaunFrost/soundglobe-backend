const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8080
const cors = require('cors')
const { createSHA256Hash } = require('./utils')

const generatedImages = {abc: 'abc'}

app.use(bodyParser.json())
app.use(cors())

app.post('/create', (req, res) => {
    const { email, imageData } = req.body
    const imageId = createSHA256Hash(email)
    generatedImages[imageId] = imageData
    res.json({
        success: true,
        id: imageId
    })
})

app.get('/', (req, res) => {
    res.send('<h1>Server is on</h1>')
})

app.get('/image/:imageId', (req, res) => {
    const { imageId } = req.params;
    const data = generatedImages[imageId];
    if (data) {
        res.json({imageData: data})
    } else {
        res.status(404).send('Image not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});