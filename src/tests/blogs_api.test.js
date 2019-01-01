const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, testBlog, blogsInDb, format, nonExistingId } = require('./test_helper')

describe('When there is content in the DB', async () => {

    beforeAll(async () => {
        await Blog.remove({})

        const blogs = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogs.map(b => b.save()))
    })


    describe('GET blogs', () => {

        test('blogs are returned', async () => {

            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const returnedBlogs = await blogsInDb()

            expect(returnedBlogs).toContainEqual(initialBlogs[0])
        })
    })


    describe('POST blogs', () => {

        test('blog can be added', async () => {

            const postResponse = await api
                .post('/api/blogs')
                .send(testBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const returnedBlog = postResponse.body
            delete returnedBlog.id

            const blogsAfterPost = await blogsInDb()

            expect(returnedBlog).toEqual(testBlog)
            expect(blogsAfterPost.length).toBe(initialBlogs.length + 1)
        })
    })
})

afterAll(() => server.close())