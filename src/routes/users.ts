import express, { Application, Request, Response, NextFunction} from 'express'
import { Router } from 'express'
import passport from 'passport';
import { checkAuthenticated, checkNotAuthenticated, } from '../middleware/authAccess'
import register from '../controllers/register';


//import session from 'express-session';
//import flash from 'express-flash';
const app: Application = express()
/*app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false

    })
)
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())


import initialize from '../controllers/passportConfig';

initialize(passport)
*/

const routes = Router()


// Register Page
routes.get('/register', checkAuthenticated, (req: Request, res: Response) => {
    res.render('register')
})

routes.post('/register', register)
/*
routes.get('/user/dashboard', checkNotAuthenticated, (req: Request, res: Response) => {
    console.log('>>>>>> user')
    console.log(req.user)
    res.render('userDashboard', { name: req.user.name })
    
})
routes.get('/admin/dashboard', checkNotAuthenticated, (req: Request, res: Response) => {
    console.log('>>>>>> user')
    console.log(req.user)
    res.render('adminDashboard', { name: req.user.name })
    
})*/


// Login Page
routes.get('/login', checkAuthenticated, (req: Request, res: Response) => {
    res.render('login')
})
// Login Handle
routes.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {
        successRedirect: '/my/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

routes.get('/my/dashboard', checkNotAuthenticated, (req: Request, res: Response) => {
    if (req.user.role === 'admin') {
        console.log('>>>>>> user')
        console.log(req.user)
        res.render('adminDashboard', { name: req.user.name })
    } else {
        console.log('>>>>>> user')
        console.log(req.user)
        res.render('userDashboard', { name: req.user.name }) 
    }
})


// Logout Handle
routes.get('/logout', (req, res) => {
    req.logOut(function () { console.log('Done logging out.'); })
    req.flash('success_msg', 'You have log yourself out')
    res.redirect('/login')
})





export default routes