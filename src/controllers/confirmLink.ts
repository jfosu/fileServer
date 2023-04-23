import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import jwt from 'jsonwebtoken'

const confirmLink = (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.params
    console.log(req.params)

    // Check if this id exist in database
    pool.query(
        `SELECT * FROM users WHERE user_id = $1`, [id], (err, result) => {
            if (err) {
                throw err
            }
            let user = result.rows[0]
            if (id !== user.user_id) {
                console.log('Invalid id...')
                return
            }
            // We have a valid id, and we have a valid user with this id
            const secret = process.env.JWT_SECRET + user.user_password
            try {
               const payload = jwt.verify(token, secret)
               res.render('reset-password', { email: user.user_email}) 
            } catch (error: any) {
                console.log('hun!')
                console.log(error.message)
            }
    })

}

export default confirmLink