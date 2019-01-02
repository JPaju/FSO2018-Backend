const { app, server } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers, usersInDb } = require('./test_helper')

describe('When there is users in DB', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const users = initialUsers.map(b => new User(b))
        await Promise.all(users.map(b => b.save()))
    })

    test('valid user can be added', async () => {

        const testUser = {
            name: 'test',
            username: 'test',
            adult: false,
            password: 'test'
        }

        const usersBefore = await usersInDb()

        await api
            .post('/api/users')
            .send(testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        expect(usersAfter.map(u => u.username)).toContainEqual(testUser.username)
        expect(usersAfter.length).toBe(usersBefore.length + 1)
    })

    test('400 response when adding user without username', async () => {

        const testUser = {
            name: 'test',
            adult: false,
            password: 'test'
        }

        const usersBefore = await usersInDb()

        await api
            .post('/api/users')
            .send(testUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        expect(usersAfter.map(u => u.username)).not.toContainEqual(testUser.username)
        expect(usersAfter.length).toBe(usersBefore.length)
    })

    test('400 response when adding user without password', async () => {

        const testUser = {
            name: 'test',
            username: 'test',
            adult: false,
        }

        const usersBefore = await usersInDb()

        await api
            .post('/api/users')
            .send(testUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        expect(usersAfter.map(u => u.username)).not.toContainEqual(testUser.username)
        expect(usersAfter.length).toBe(usersBefore.length)
    })

    test('400 response when adding user without name', async () => {

        const testUser = {
            username: 'test',
            adult: false,
            password: 'test'
        }

        const usersBefore = await usersInDb()

        await api
            .post('/api/users')
            .send(testUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        expect(usersAfter.map(u => u.username)).not.toContainEqual(testUser.username)
        expect(usersAfter.length).toBe(usersBefore.length)
    })

    test('400 response when adding user with too short password', async () => {

        const testUser = {
            username: 'test',
            name: 'test',
            adult: false,
            password: 't'
        }

        const usersBefore = await usersInDb()

        await api
            .post('/api/users')
            .send(testUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        expect(usersAfter.map(u => u.username)).not.toContainEqual(testUser.username)
        expect(usersAfter.length).toBe(usersBefore.length)
    })
})

afterAll(async () => {
    await User.deleteMany({})
    const users = initialUsers.map(b => new User(b))
    await Promise.all(users.map(b => b.save()))
    server.close()
})
