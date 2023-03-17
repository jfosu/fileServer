// Check credentials and log in user
const LocalStrategy = require("passport-local").Strategy
import pool from "../dbConfig/db"
import bcrypt from 'bcrypt'

function initialize(passport: any) {
    const authenticateUser = (email: string, password: string, done: any) => {
        pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err
                }
                console.log(results.rows)
                if (results.rows.length > 0) {
                    const user = results.rows[0]

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err
                        }

                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Password is not correct"})
                        }
                    })
                } else {
                    return done(null, false, { message: "Email is not registered"})
                }
            }
        )
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    )

    passport.serializeUser((user: any, done: any) => done(null, user.id))

    passport.deserializeUser((id: number, done: any) => {
        pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
            if (err) {
                throw err
            }
            return done(null, results.rows[0])
        })
    })
}

export default initialize