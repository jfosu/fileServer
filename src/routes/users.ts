import express, { Application, Request, Response, NextFunction} from 'express'
import { Router } from 'express'
import passport from 'passport';
import multer from 'multer';
import { checkAuthenticated, checkNotAuthenticated, } from '../middleware/authAccess'
import register from '../controllers/register';
import forgotPassword from '../controllers/forgot-password';
import confirmLink from '../controllers/confirmLink';
import resetPassword from '../controllers/reset-password';
import uploadForm from '../controllers/uploadForm';
import allFiles from '../controllers/allFiles';
import searchFile from '../controllers/searchFile';
import mail_form_sent from '../controllers/mail_form_sent';
import pool from '../dbConfig/db';


const app: Application = express()

const routes = Router()


// Register Page
routes.get('/register', checkAuthenticated, (req: Request, res: Response) => {
    res.render('register')
})

routes.post('/register', register)


// Login Page
routes.get('/login', checkAuthenticated, (req: Request, res: Response) => {
    res.render('login')
})
// Login Handle
routes.post('/login', (req: Request, res: Response, next: NextFunction) => {
    console.log('session >>>>', req.session)
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})


routes.get('/dashboard', checkNotAuthenticated, allFiles)


// Logout Handle
routes.get('/logout', (req, res) => {
    req.logOut(function () { console.log('Done logging out.'); })
    req.flash('success_msg', 'You have log yourself out')
    res.redirect('/login')
})

routes.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password')
})  

routes.post('/forgot-password', forgotPassword)    

routes.get('/reset-password/:id/:token', confirmLink)


routes.post('/reset-password/:id/:token', resetPassword)

routes.post('/mail_form', checkNotAuthenticated, (req, res) => {
    const { file_id, filename, description, myfile, downloads, mails_sent } = req.body
    console.log(req.body)
    res.render('mailForm', { file_id, filename, description, myfile, downloads, mails_sent })
})

routes.post('/mail_form_sent', mail_form_sent)

routes.get('/uploadform', checkNotAuthenticated, (req, res) => {
    if (req.user.user_role === 'admin') {
        res.render('uploadForm')
    }
    res.redirect('/dashboard')
    
})

routes.post('/uploadform', checkNotAuthenticated, uploadForm)

// search by file title
routes.get('/searchfile', checkNotAuthenticated, (req, res) => {
    res.render('searchfile')
})
routes.post('/searchfile', searchFile)



export default routes