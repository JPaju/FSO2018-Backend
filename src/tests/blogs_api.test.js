const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb, blogInDb, format } = require('./test_helper')

describe('When there is content in the DB', async () => {



    describe('GET /api/blogs', () => {

        beforeEach(async () => {
            await Blog.remove({})

            const blogs = initialBlogs.map(b => new Blog(b))
            await Promise.all(blogs.map(b => b.save()))
        })

        test('all blogs are returned as json', async () => {

            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const returnedBlogs = await blogsInDb()

            expect(returnedBlogs).toContainEqual(initialBlogs[0])
        })
    })


    describe('POST /api/blogs', () => {

        beforeEach(async () => {
            await Blog.remove({})
        })

        test('valid blog can be added', async () => {

            const testBlog = {
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
            }

            const blogsBeforePost = await blogsInDb()

            const response = await api
                .post('/api/blogs')
                .send(testBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const returnedBlog = response.body
            delete returnedBlog.id

            const blogsAfterPost = await blogsInDb()

            expect(returnedBlog).toEqual(testBlog)
            expect(blogsAfterPost.length).toBe(blogsBeforePost.length + 1)
            expect(blogsAfterPost).toContainEqual(testBlog)
        })

        test('defaults to likes 0 if not spesified', async () => {

            const testBlog = {
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
            }

            const response = await api
                .post('/api/blogs')
                .send(testBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const addedBlog = await Blog.findById(response.body.id)

            expect(addedBlog.likes).toBe(0)
        })

        test('400 returned when not spesifying title', async () => {
            const testBlog = {
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7
            }

            await api
                .post('/api/blogs')
                .send(testBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)

        })

        test('400 returned when not spesifying url', async () => {
            const testBlog = {
                title: 'React patterns',
                author: 'Michael Chan',
                likes: 7
            }

            await api
                .post('/api/blogs')
                .send(testBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)

        })
    })

    describe('PUT /api/blogs/:id', () => {
        let blogToEdit

        beforeEach(async () => {
            blogToEdit = new Blog({
                title: 'HTTP PUT',
                author: 'Put Tester',
                url: 'https://testing.put/',
                likes: 10
            })
            await blogToEdit.save()
        })

        test('Modifies field correctly', async () => {

            const response = await api
                .put(`/api/blogs/${blogToEdit._id}`)
                .send({ likes: 111 })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const updatedBlog = await blogInDb(blogToEdit._id)

            expect(response.body.likes).toBe(111)
            expect(updatedBlog.likes).toBe(111)
        })
    })

    describe('DELETE /api/blogs/:id', () => {

        const blogToDelete = new Blog({
            title: 'HTTP DELETE',
            author: 'Delete Tester',
            url: 'https://testing.delete/'
        })

        beforeEach(async () => {
            await blogToDelete.save()
        })

        test('204 is returned and blog is removed', async () => {

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const afterDeletion = await blogsInDb()

            expect(afterDeletion).not.toContainEqual(format(blogToDelete))
        })
    })
})

afterAll(async () => {
    await Blog.remove({})
    const blogs = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogs.map(b => b.save()))
    server.close()
})
