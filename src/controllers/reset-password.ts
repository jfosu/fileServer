import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const app: Application = express()



const resetPassword = async (req: Request, res: Response) => {
    const { id, token } = req.params
    const { password, password2 } = req.body
    console.log({
        password,
        password2
    })

    let errors: any = []

    if (!password || !password2) {
        errors.push({ msg: 'Please enter all fields'})
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'})
    }

    if (password != password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    if (errors.length > 0) {
        res.render('reset-password', { errors })
        /*return res.status(400).json({
            errors: errors
        })*/
    } else {
        // Form validation has passed

        let hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)

        pool.query(
            `SELECT * FROM users WHERE user_id = $1`, [id], (err, result) => {
                if (err) {
                    throw err
                }
                console.log(result.rows)
                let user = result.rows[0]
                if (id !== user.id) {
                    errors.push({ msg: 'Invalid id...'})
                    res.render('reset-password', { errors })
                } else {
                    const secret = process.env.JWT_SECRET + user.password
                    const payload = jwt.verify(token, secret)
                    user.password = hashedPassword
                    pool.query(`UPDATE users SET user_password = $1 WHERE user_id = $2`, [user.password, id], (err, result) => {
                        if (err) {
                            throw err
                        }
                        console.log(result.rows)
                        req.flash('success_msg', 'Password reset done successfully')
                        res.redirect('/login')
                    })
                }
            }
        )
    }
}


export default resetPassword