const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const url = process.env.MONGODB_CONTACTS_URL
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true })

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    number: String
})

//Formats contact to from database format to frontend
ContactSchema.statics.format = function(contact) {
    const formattedContact = { ...contact._doc, id: contact._id }
    delete formattedContact._id
    delete formattedContact.__v
    return formattedContact
}

const Contact = mongoose.model('Contact', ContactSchema)

module.exports = Contact