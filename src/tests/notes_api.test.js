const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

describe('GET notes', () => {

    test('response is json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

})

afterAll(() => server.close())