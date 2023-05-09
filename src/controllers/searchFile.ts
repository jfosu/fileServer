import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'

/**
 * @openapi
 * components:
 *   schemas:
 *     SearchFilesInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           default: Wodin Fabrics
 *     SearchFilesResponse:
 *       type: object
 *       properties:
 *         login_user:
 *           type: string
 *         file_id:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 */

const searchFile = async (req: Request, res: Response) => {
    const { title } = req.body
    if (!title) {
        // res.redirect('/dashboard')
        res.status(400).json({"Invalid Input": "Enter file title the next time"})
    }
    try {
        const results = await pool.query(
            `SELECT file_id, title, description, image FROM files WHERE title ILIKE $1`, [`%${title}%`]
        )
        let searchfiles = results.rows
        console.log(searchfiles)
        // res.render('searchFile', { searchfiles: searchfiles, name: req.user.user_name })
        res.status(200).json({"Login User:": req.user.user_name, searchfiles})
        
    } catch (err: any) {
        console.error(err.message)
        
    }
    
}

export default searchFile