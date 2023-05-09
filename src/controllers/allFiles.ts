import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'


/**
 * @openapi
 * components:
 *   schemas:
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: john@gmail.com
 *         password:
 *           type: string
 *           default: john123
 *     LoginUserResponse:
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


const allFiles = async (req: Request, res: Response) => {
    if (req.user.is_admin === true) {
        console.log('>>>>>> user')
        console.log(req.user)
        try {
            let userfiles = await pool.query(
                `SELECT * FROM files ORDER BY uploaded_at DESC`,
            )
            console.log(userfiles.rows)
            let files = userfiles.rows
            // res.render('adminDashboard', { files: files, name: req.user.user_name })
            res.status(200).json({"Login User:": req.user.user_name, files})
    
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
                `SELECT file_id, title, description, image FROM files ORDER BY uploaded_at DESC`
            )
            console.log(userfiles.rows)
            let files = userfiles.rows
            // res.render('userDashboard', { files: files, name: req.user.user_name })
            res.status(200).json({"Login User:": req.user.user_name, files})
    
        } catch (err: any) {
            console.error(err.message)
        }
         
    } 
}

export default allFiles