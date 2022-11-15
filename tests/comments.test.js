const fs = require('fs')
const request = require('supertest')
const makeApp = require('../app')

const comments = {
  getCommentsList: jest.fn(),
  insertComment: jest.fn(),
  getComment: jest.fn(),
  deleteComment: jest.fn()
}

const fileManager = {
  upload: jest.fn()
}

const server = makeApp({ comments }, { fileManager })

describe('Comments', () => {
  beforeEach(() => {
    comments.getCommentsList.mockReset()
    comments.insertComment.mockReset()
    comments.getComment.mockReset()
    comments.deleteComment.mockReset()
    fileManager.upload.mockReset()
  })

  describe('GET /comments', () => {
    test('Get 10 comments if no limit is specified', async () => {
      comments.getCommentsList.mockResolvedValueOnce(dummyData)

      const body = { postId: '1' }
      const res = await request(server)
        .get('/comments')
        .send(body)

      expect(comments.getCommentsList.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comments retrieved successfully')
      expect(res.body).toHaveProperty('comments')
      expect(res.body.comments).toHaveLength(10)
    })

    test('Get 10 comments if limit is greater than 10', async () => {
      comments.getCommentsList.mockResolvedValueOnce(dummyData)

      const body = { postId: '1' }
      const queryParams = { limit: 20 }
      const res = await request(server)
        .get('/comments')
        .query(queryParams)
        .send(body)

      expect(comments.getCommentsList.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comments retrieved successfully')
      expect(res.body).toHaveProperty('comments')
      expect(res.body.comments).toHaveLength(10)
    })

    test('Get 1 comments if limit is 1', async () => {
      comments.getCommentsList.mockResolvedValueOnce([dummyData[0]])

      const body = { postId: '1' }
      const queryParams = { limit: 1 }
      const res = await request(server)
        .get('/comments')
        .query(queryParams)
        .send(body)

      expect(comments.getCommentsList.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comments retrieved successfully')
      expect(res.body).toHaveProperty('comments')
      expect(res.body.comments).toHaveLength(1)
    })

    test('Get 0 comments if limit is 0 or less OR offset is less than 0', async () => {
      comments.getCommentsList.mockResolvedValueOnce([])

      const body = { postId: '1' }
      const queryParams = { limit: 0 }
      const res = await request(server)
        .get('/comments')
        .query(queryParams)
        .send(body)

      expect(comments.getCommentsList.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Limit or offset are too low')
    })

    test('Get 0 comments if limit or offset are not a number', async () => {
      comments.getCommentsList.mockResolvedValueOnce([])

      const body = { postId: '1' }
      const queryParams = { limit: 'a' }
      const res = await request(server)
        .get('/comments')
        .query(queryParams)
        .send(body)

      expect(comments.getCommentsList.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Limit and offset must be numbers')
    })

    test('Get 0 comments if postId not specified', async () => {
      comments.getCommentsList.mockResolvedValueOnce([])

      const body = {}
      const res = await request(server)
        .get('/comments')
        .send(body)

      expect(comments.getCommentsList.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('PostId is required')
    })
  })

  describe('POST /comments', () => {
    test('Post a new comment with a file attached', async () => {
      fileManager.upload.mockResolvedValueOnce({ key: 'file.jpg' })
      comments.insertComment.mockResolvedValueOnce()

      const res = await request(server)
        .post('/comments')
        .field('postId', '1')
        .field('userId', '1')
        .field('content', 'This is a comment')
        .attach('attachment', fs.readFileSync('./tests/dummy.pdf'), 'dummy.pdf')

      expect(fileManager.upload.mock.calls.length).toBe(1)
      expect(comments.insertComment.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comment created successfully')
    })

    test('Post a new comment without a file attached', async () => {
      fileManager.upload.mockResolvedValueOnce({ key: '' })
      comments.insertComment.mockResolvedValueOnce()

      const res = await request(server)
        .post('/comments')
        .field('postId', '1')
        .field('userId', '1')
        .field('content', 'This is a comment')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(comments.insertComment.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comment created successfully')
    })

    test('Post a new comment without a post id', async () => {
      fileManager.upload.mockResolvedValueOnce({ key: '' })
      comments.insertComment.mockResolvedValueOnce()

      const res = await request(server)
        .post('/comments')
        .field('userId', '1')
        .field('content', 'This is a comment')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(comments.insertComment.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Post ID is required')
    })

    test('Post a new comment without a user id', async () => {
      fileManager.upload.mockResolvedValueOnce({ key: '' })
      comments.insertComment.mockResolvedValueOnce()

      const res = await request(server)
        .post('/comments')
        .field('postId', '1')
        .field('content', 'This is a comment')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(comments.insertComment.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('User ID is required')
    })

    test('Post a new comment without a content', async () => {
      fileManager.upload.mockResolvedValueOnce({ key: '' })
      comments.insertComment.mockResolvedValueOnce()

      const res = await request(server)
        .post('/comments')
        .field('postId', '1')
        .field('userId', '1')

      expect(fileManager.upload.mock.calls.length).toBe(0)
      expect(comments.insertComment.mock.calls.length).toBe(0)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Content is required')
    })
  })

  describe('GET /comments/:id', () => {
    test('Get a comment by id', async () => {
      comments.getComment.mockResolvedValueOnce(dummyData[0])

      const res = await request(server).get('/comments/1')

      expect(comments.getComment.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comment retrieved successfully')
      expect(res.body).toHaveProperty('comment')
    })

    test('Get a comment by id that does not exist', async () => {
      comments.getComment.mockResolvedValueOnce()

      const res = await request(server).get('/comments/1')

      expect(comments.getComment.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comment not found')
    })
  })

  describe('DELETE /comments/:id', () => {
    test('Delete a comment by id', async () => {
      comments.deleteComment.mockResolvedValueOnce()

      const res = await request(server).delete('/comments/1')

      expect(comments.deleteComment.mock.calls.length).toBe(1)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Comment deleted successfully')
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
