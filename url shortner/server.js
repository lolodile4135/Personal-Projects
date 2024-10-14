const express = require("express")
const app = express()
require('dotenv').config()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

const mongoose = require('mongoose')
const ShortUrl = require('./models/model')
mongoose.connect('mongodb://localhost:27017/shorturl').then(console.log("connected to database")
)

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullurl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl === null) {
        return res.status(404)
    }
    shortUrl.clicks++;
    shortUrl.save()
    res.redirect(shortUrl.full);
})




app.listen(process.env.PORT, () => {
    console.log(`listening at port ${process.env.PORT}`);

})