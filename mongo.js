const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const url = process.env.MONGODB_NOTES_URL
mongoose.connect(url, {useNewUrlParser: true})

const Note = mongoose.model('Note', {
    content: String,
    date: Date,
    important: Boolean
})

const saveNote = ({content, important}) => {
    const note = new Note({
        content: content,
        date: new Date(),
        important: important
    })

    note
        .save()
        .then(response => {
            mongoose.connection.close()
        })
}

const printNotes = () => {
    Note
        .find({})
        .then(result => {
            result.forEach((note, index) => {
                console.log(`${++index}. ${note.content}, tärkeä: ${note.important}`)
            })
            mongoose.connection.close()
        })
}

const content = process.argv[2]
const important = !!process.argv[3] && (process.argv[3] === 'true')

if (content) {
    console.log(`Lisätään muistiinpano ${content}, tärkeä:${important}`)
    saveNote({content, important})
} else {
    printNotes()
}


/*
Note
    .find({important: true})
    .then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
    
    note
    .save()
    .then(response => {
        console.log(`note: ${note} was saved!`)
        mongoose.connection.close()
    })
*/