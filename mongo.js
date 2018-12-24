const mongoose = require('mongoose')

const url = 'mongodb://usr:passwd@ds135974.mlab.com:35974/fso-phonebook'
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
