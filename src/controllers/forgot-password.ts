import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import jwt from 'jsonwebtoken'


const PORT = process.env.PORT || 5000;

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    let errors: any = []

    // Make sure user exist in database with this email
    pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
            if (err) {
                throw err
            }

            if (result.rows.length === 0) {
                errors.push({ msg: 'User with this email does not exist'})
                return res.render('forgot-password', { errors })
            } else {
                // User exist and now create a One time link valid for 15minutes

                console.log(result.rows)
                let user = result.rows[0]
                const secret = process.env.JWT_SECRET + user.password
                const payload = {
                    email: user.email,
                    id: user.id
                }
                const token = jwt.sign(payload, secret, { expiresIn: '15m'})
                const link = `http://localhost:${PORT}/reset-password/${user.id}/${token}`
                console.log(link)
                res.send('Password reset link has been sent to your email ...')
                
                

            }
    })

}

export default forgotPassword