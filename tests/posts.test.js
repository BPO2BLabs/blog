const fs = require('fs')
const request = require('supertest')
const makeApp = require('../app')

const posts = {
  getPostsList: jest.fn(),
  insertPost: jest.fn(),
  getPost: jest.fn(),
  deletePost: jest.fn()
}

const fileManager = {
  upload: jest.fn()
}

const server = makeApp({ posts }, { fileManager })

describe('Posts', () => {
  beforeEach(() => {
    posts.getPostsList.mockReset()
    posts.insertPost.mockReset()
    posts.getPost.mockReset()
    posts.deletePost.mockReset()
    fileManager.upload.mockReset()
  })

  describe('GET /posts', () => {
    test('Get 10 posts if no limit is specified', async () => {
      posts.getPostsList.mockResolvedValueOnce(dummyData)

      const body = { userId: '1' }

      const res = await request(server)
        .get('/posts')
        .send(body)

      expect(posts.getPostsList.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Posts retrieved successfully')
      expect(res.body).toHaveProperty('posts')
      expect(res.body.posts).toHaveLength(10)
    })

    test('Get 10 posts if limit is greater than 10', async () => {
      posts.getPostsList.mockResolvedValueOnce(dummyData)

      const body = { userId: '1' }
      const queryParams = { limit: 20 }
      const res = await request(server)
        .get('/posts')
        .query(queryParams)
        .send(body)
      
      expect(posts.getPostsList.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Posts retrieved successfully')
      expect(res.body).toHaveProperty('posts')
      expect(res.body.posts).toHaveLength(10)
    })

    test('Get 1 post if limit is 1', async () => {
      posts.getPostsList.mockResolvedValueOnce([dummyData[0]])

      const queryParams = { limit: 1 }
      const body = { userId: '1' }
      const res = await request(server)
        .get('/posts')
        .query(queryParams)
        .send(body)

      expect(posts.getPostsList.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Posts retrieved successfully')
      expect(res.body).toHaveProperty('posts')
      expect(res.body.posts).toHaveLength(1)
    })

    test('Get 0 posts if limit is 0 or less OR offset is less than 0', async () => {
      posts.getPostsList.mockResolvedValueOnce([])

      const body = { userId: '1' }
      const queryParams = { limit: 0, offset: -1 }
      const res = await request(server)
        .get('/posts')
        .query(queryParams)
        .send(body)

      expect(posts.getPostsList.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('posts')
      expect(res.body.posts).toHaveLength(0)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Limit or offset are too low')
    })

    test('Get 0 posts if limit or offset are not a numbers', async () => {
      posts.getPostsList.mockResolvedValueOnce([])

      const body = { userId: '1' }
      const queryParams = { limit: 'abc' }
      const res = await request(server)
        .get('/posts')
        .query(queryParams)
        .send(body)

      expect(posts.getPostsList.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('posts')
      expect(res.body.posts).toHaveLength(0)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Limit and offset must be numbers')
    })
  })

  describe('POST /posts', () => {
    test('Post a new post with a file attached', async () => {
      fileManager.upload.mockResolvedValueOnce({ name: 'example.jpg' })
      posts.insertPost.mockResolvedValueOnce()

      const res = await request(server)
        .post('/posts')
        .field('userId', '1')
        .field('content', 'Hello world')
        .attach('attachment', fs.readFileSync('./tests/dummy.pdf'), 'dummy.pdf')

      expect(fileManager.upload.mock.calls.length).toBe(1)
      expect(posts.insertPost.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Post created successfully')
    })

    test('Post a new post without a file attached', async () => {
      fileManager.upload.mockResolvedValueOnce({ name: '' })
      posts.insertPost.mockResolvedValueOnce()

      const res = await request(server)
        .post('/posts')
        .field('userId', '1')
        .field('content', 'Hello world')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(posts.insertPost.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Post created successfully')
    })

    test('Post a new post without an user id', async () => {
      fileManager.upload.mockResolvedValueOnce({ name: '' })
      posts.insertPost.mockResolvedValueOnce()

      const res = await request(server)
        .post('/posts')
        .field('content', 'Hello world')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(posts.insertPost.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('User ID is required')
    })

    test('Post a new post without content', async () => {
      fileManager.upload.mockResolvedValueOnce({ name: '' })
      posts.insertPost.mockResolvedValueOnce()

      const res = await request(server)
        .post('/posts')
        .field('userId', '1')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(posts.insertPost.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Content is required')
    })
  })

  describe('GET /posts/:id', () => {
    test('Get a post by id', async () => {
      posts.getPost.mockResolvedValueOnce(dummyData[0])

      const res = await request(server)
        .get('/posts/1')
      
      expect(posts.getPost.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Post retrieved successfully')
      expect(res.body).toHaveProperty('post')
    })

    test('Get a post by id that does not exist', async () => {
      posts.getPost.mockResolvedValueOnce(null)

      const res = await request(server)
        .get('/posts/1')
      
      expect(posts.getPost.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Post not found')
    })
  })

  describe('DELETE /posts/:id', () => {
    test('Delete a post by id', async () => {
      posts.deletePost.mockResolvedValueOnce()

      const res = await request(server)
        .delete('/posts/1')
      
      expect(posts.deletePost.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Post deleted successfully')
    })
  })
})

const dummyData = [
  {
    post_id: '1',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '2',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '3',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '4',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '5',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '6',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '7',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '8',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '9',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  },
  {
    post_id: '10',
    content: 'Hello world',
    create_date: '2020-01-01T00:00:00.000Z',
    file_name: 'file.jpg',
    file_url: 'http://localhost:3000/file.jpg',
    user_id: '1'
  }
]
