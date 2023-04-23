import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'


const allFiles = async (req: Request, res: Response) => {
    if (req.user.user_role === 'admin') {
        console.log('>>>>>> user')
        console.log(req.user)
        try {
            let userfiles = await pool.query(
                `SELECT * FROM files`,
            )
            console.log(userfiles.rows)
            let files = userfiles.rows
            res.render('adminDashboard', { files: files, name: req.user.user_name })
    
        } catch (err: any) {
            console.error(err.message)
        }
        
    } else {
        console.log('>>>>>> user')
        console.log(req.user)
        console.log('session>>>', req.session)
        /*countFiles(cart)*/
        try {
            let userfiles = await pool.query(
                `SELECT * FROM files`
            )
            console.log(userfiles.rows)
            let files = userfiles.rows
            res.render('userDashboard', { files: files, name: req.user.user_name })
    
        } catch (err: any) {
            console.error(err.message)
        }
         
    } 
}

export default allFiles