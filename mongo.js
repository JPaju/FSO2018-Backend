const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const url = process.env.MONGODB_CONTACTS_URL
mongoose.connect(url, {useNewUrlParser: true})

const Contact = mongoose.model('Contact', {
    name: String,
    number: String
})

const saveContact = ({name, number}) => {
    const contact = new Contact({
        name,
        number
    })
    
    contact
    .save()
    .then(response => {
        mongoose.connection.close()
    })
}

const printContacts = () => {
    console.log('Puhelinluettelo:')
    Contact
        .find({})
        .then(result => {
            result.forEach(contact => {
                console.log(contact.name, contact.number)
            })
            mongoose.connection.close()
        })
}

const name = process.argv[2]
const number = process.argv[3]

if (name || number) {
    console.log(`Lisätään henkilö ${name}, numero ${number}`)
    saveContact({name, number})
} else {
    printContacts()
}
