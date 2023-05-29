import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import jwt from 'jsonwebtoken'

/**
 * @openapi
 * components:
 *   schemas:
 *     ValidateLink:
 *       type: object
 *       required:
 *         - link
 *       properties:
 *         link:
 *           type: string
 *         email:
 *           type: string
 */

const confirmLink = async(req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.params
    try {
        const results = await pool.query(
            `SELECT * FROM users WHERE user_id = $1`, [id]
        )
        const user = results.rows[0]   
        const secret = process.env.JWT_SECRET + user.user_password
        if (id !== user.user_id) {
            console.log('Invalid id...')
            // return res.status(400).json({error_msg: "Invalid id..."})
        }
        const payload = jwt.verify(token, secret)
        res.render('resetPassword')
        // res.status(200).json({"Link": "This link is valid", email: user.user_email})
        
    } catch (error: any) {
        // res.status(409).json({error_msg: 'Invalid token or id'})
    }
}

export default confirmLink