const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const testContent = 'Note used by tests!'

describe('GET notes', () => {

    test('response is json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('spesific note can be viewed', async () => {
        const allNotes = await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const singleNote = allNotes.body[0]

        const resultNote = await api
            .get(`/api/notes/${singleNote.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(singleNote).toEqual(resultNote.body)
    })

})


describe('POST notes', () => {

    test('note can be added', async () => {

        const initialNotes = await api
            .get('/api/notes')
            .then(res => res.body.map(r => r.content))

        const newNote = {
            content: testContent,
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)
            .expect('Content-type', /application\/json/)

        const response = await api
            .get('/api/notes')
            .then(res => res.body.map(r => r.content))

        expect(response.length).toBe(initialNotes.length + 1)
        expect(response).toContain(testContent)
    })

    test('note without content cannot be added', async () => {

        const initialNotes = await api
            .get('/api/notes')
            .then(res => res.body.map(r => r.content))

        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const response = await api
            .get('/api/notes')
            .then(res => res.body.map(r => r.content))

        expect(response.length).toBe(initialNotes.length)

    })
})


describe('DELETE notes', () => {

    test('test-note created by tests', async () => {

        let initialNotes = await api
            .get('/api/notes')
            .then(res => res.body)

        if (!initialNotes.find(note => note.content === testContent)) {
            //Create test-note if not present
            await api
                .post('/api/notes')
                .send({
                    content: testContent,
                    important: true
                })

            //Fetch notes to include test-note
            initialNotes = await api
                .get('/api/notes')
                .then(res => res.body)
        }

        const id = initialNotes
            .find(note => note.content === testContent).id

        const deleteResponse = await api
            .delete(`/api/notes/${id}`)
            .expect(204)

        const getResponse = await api
            .get('/api/notes')
            .then(res => res.body.map(r => r.content))

        expect(deleteResponse.body).toEqual({})
        expect(getResponse.find(note => note.content === testContent)).toBeFalsy()
    })
})

afterAll(() => server.close())