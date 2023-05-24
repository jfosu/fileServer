import { Request, Response } from 'express'
import pool from '../../dbConfig/db'
import allFiles from '../../controllers/allFiles'

// Mock the pool object
jest.mock('../../dbConfig/db', () => ({
  query: jest.fn(),
}))

describe('allFiles', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    // Create mock req and res objects
    req = {} as Request
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return all files for admin', async () => {
    // Set up mock data
    const mockUser = {
      is_admin: true,
      user_name: 'admin',
    }
    const mockFiles = [
      { file_id: 1, title: 'File 1', description: 'Description 1', image: 'Image 1' },
      { file_id: 2, title: 'File 2', description: 'Description 2', image: 'Image 2' },
    ]
    // @ts-ignore
    const mockPoolQuery = jest.spyOn(pool, 'query').mockResolvedValueOnce({ rows: mockFiles })

    // Call the function
    await allFiles({ user: mockUser } as Request, res)

    // Check the results
    expect(mockPoolQuery).toHaveBeenCalledWith(
      `SELECT * FROM files ORDER BY uploaded_at DESC`
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      'Login User:': 'admin',
      files: mockFiles,
    })
  })

  it('should return all files for user', async () => {
    // Set up mock data
    const mockUser = {
      is_admin: false,
      user_name: 'user',
    }
    const mockFiles = [
      { file_id: 1, title: 'File 1', description: 'Description 1', image: 'Image 1' },
      { file_id: 2, title: 'File 2', description: 'Description 2', image: 'Image 2' },
    ]
    // @ts-ignore
    const mockPoolQuery = jest.spyOn(pool, 'query').mockResolvedValueOnce({ rows: mockFiles })

    // Call the function
    await allFiles({ user: mockUser } as Request, res)

    // Check the results
    expect(mockPoolQuery).toHaveBeenCalledWith(
      `SELECT file_id, title, description, image FROM files ORDER BY uploaded_at DESC`
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      'Login User:': 'user',
      files: mockFiles,
    })
  })
})
