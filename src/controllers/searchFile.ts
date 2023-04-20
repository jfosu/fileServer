import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'

const searchFile = async (req: Request, res: Response) => {
    const { title } = req.body
    if (!title) {
        res.redirect('/dashboard')
    }
    try {
        const results = await pool.query(
            `SELECT * FROM files WHERE title ILIKE $1`, [`%${title}%`]
        )
        let searchfiles = results.rows
        console.log(searchfiles)
        res.render('searchFile', { searchfiles: searchfiles, name: req.user.user_name })
        
    } catch (err: any) {
        console.error(err.message)
        
    }
    
}

export default searchFile