import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import bcrypt from 'bcrypt'
const app: Application = express()



const register = async (req: Request, res: Response) => {
    let role: string = 'auser'
    let { name, email, password, password2 } = req.body
    console.log({
        name,
        email,
        password,
        password2
    })

    let errors: any = []

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields'})
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'})
    }

    if (password != password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    if (errors.length > 0) {
        res.render('register', { errors })
        /*return res.status(400).json({
            errors: errors
        })*/
    } else {
        // Form validation has passed

        let hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)

        pool.query(
            `SELECT * FROM users WHERE user_email = $1`, [email], (err, result) => {
                if (err) {
                    throw err
                }
                console.log(result.rows)

                if (result.rows.length > 0) {
                    errors.push({ msg: 'Email already registered'})
                    res.render('register', { errors })
                } else {
                    pool.query(
                        `INSERT INTO users (user_name, user_email, user_password, user_role)
                        VALUES ($1, $2, $3, $4)
                        RETURNING user_id, user_password`, [name, email, hashedPassword, role],
                        (err, result) => {
                            if (err) {
                                throw err
                            }
                            console.log(result.rows)
                            req.flash('success_msg', 'You are now registered, Please log in')
                            res.redirect('/login')
                        }
                    )
                }
            }
        )
    }
}


export default register
