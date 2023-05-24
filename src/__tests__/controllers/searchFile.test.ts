// Import the necessary modules and functions
import pool from '../../dbConfig/db'
import searchFile from '../../controllers/searchFile'

// Mock the pool.query function to return a sample result
jest.mock('../../dbConfig/db', () => ({
  query: jest.fn(() => ({
    rows: [{
      file_id: 1,
      title: 'Sample File',
      description: 'This is a sample file',
      image: 'http://example.com/sample.jpg'
    }]
  }))
}))

// Define the test suite
describe('searchFile', () => {
  // Define the test case for the successful search
  test('returns the correct search results', async () => {
    // Mock the req and res objects
    const req = { body: { title: 'Sample' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Call the searchFile function with the mocked objects
    // @ts-ignore
    await searchFile(req, res)

    // Verify that the pool.query function was called with the correct arguments
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT file_id, title, description, image FROM files WHERE title ILIKE $1',
      ['%Sample%']
    )

    // Verify that the response contains the correct data
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      searchfiles: [{
        file_id: 1,
        title: 'Sample File',
        description: 'This is a sample file',
        image: 'http://example.com/sample.jpg'
      }]
    })
  })

  // Define the test case for the invalid input
  test('returns an error for invalid input', async () => {
    // Mock the req and res objects
    const req = { body: {} }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Call the searchFile function with the mocked objects
    // @ts-ignore
    await searchFile(req, res)

    // Verify that the response contains the correct error message
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ 'Invalid Input': 'Enter file title the next time' })
  })

  // Define the test case for the search result not found
  test('returns an error when the file is not found', async () => {
    // Mock the req and res objects
    const req = { body: { title: 'Non-existing File' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Call the searchFile function with the mocked objects
    // @ts-ignore
    await searchFile(req, res)

    // Verify that the pool.query function was called with the correct arguments
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT file_id, title, description, image FROM files WHERE title ILIKE $1',
      ['%Non-existing File%']
    )

    // Verify that the response contains the correct error message
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error_msg: 'file does not exist' })
  })
})
