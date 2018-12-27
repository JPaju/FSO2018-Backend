const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const url = process.env.MONGODB_CONTACTS_URL
mongoose.connect(url, {useNewUrlParser: true})

const Contact = mongoose.model('Contact', {
    name: String,
    number: String
})

module.exports(Contact)