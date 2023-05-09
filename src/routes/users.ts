import express, { Application, Request, Response, NextFunction} from 'express'
import { Router } from 'express'
import passport from 'passport';
import { checkAuthenticated, checkNotAuthenticated, } from '../middleware/authAccess'
import register from '../controllers/register';
import forgotPassword from '../controllers/forgot-password';
import confirmLink from '../controllers/confirmLink';
import resetPassword from '../controllers/reset-password';
import uploadForm from '../controllers/uploadForm';
import allFiles from '../controllers/allFiles';
import searchFile from '../controllers/searchFile';
import mail_form_sent from '../controllers/mail_form_sent';
import download_file from '../controllers/download_file';


const app: Application = express()

const routes = Router()


// Register Page
routes.get('/register', checkAuthenticated, (req: Request, res: Response) => {
    res.render('register')
})

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - Register
 *     summary: Register a User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */


routes.post('/register', register)

// Login Page
routes.get('/login', checkAuthenticated, (req: Request, res: Response) => {
    res.render('login')
})
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     summary: Log user into dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */


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
/**
 * @openapi
 * /forgot-password:
 *   post:
 *     tags:
 *       - Forgot Password
 *     summary: Can't remember your password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */  

routes.post('/forgot-password', forgotPassword)
/**
 * @openapi
 * /reset-password/{id}/{token}:
 *   get:
 *     tags:
 *       - Validate link
 *     summary: validating reset password link
 *     parameters:
 *       - name: id
 *         in: path
 *         description: provide id from reset password link
 *         required: true
 *       - name: token
 *         in: path
 *         description: provide token from reset password link
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateLink'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */

    

routes.get('/reset-password/:id/:token', confirmLink)
/**
 * @openapi
 * /reset-password/{id}/{token}:
 *   post:
 *     tags:
 *       - Reset Password
 *     summary: Reset your password
 *     parameters:
 *       - name: id
 *         in: path
 *         description: provide id from reset password link
 *         required: true
 *       - name: token
 *         in: path
 *         description: provide token from reset password link
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordForm'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */


routes.post('/reset-password/:id/:token', resetPassword)

routes.post('/mail_form', checkNotAuthenticated, (req, res) => {
    const { file_id, filename, description, myfile, downloads, mails_sent } = req.body
    console.log(req.body)
    res.render('mailForm', { file_id, filename, description, myfile, downloads, mails_sent })
})

routes.post('/mail_form_sent', mail_form_sent)

routes.post('/download_file', download_file)

routes.get('/uploadform', checkNotAuthenticated, (req, res) => {
    if (req.user.is_admin === true) {
        res.render('uploadForm')
    }
    res.redirect('/dashboard')
    
})
/**
 * @openapi
 * /uploadform:
 *   post:
 *     tags:
 *       - File Upload
 *     summary: Upload a file with title and description
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               description:
 *                 type: string
 *               myfile:
 *                 type: string
 *                 format: binary
 *             required:
 *               - filename
 *               - description
 *               - myfile
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */



routes.post('/uploadform', checkNotAuthenticated, uploadForm)

// search by file title
routes.get('/searchfile', checkNotAuthenticated, (req, res) => {
    res.render('searchfile')
})
/**
 * @openapi
 * /searchfile:
 *   post:
 *     tags:
 *       - Search Files
 *     summary: Search for files by file title
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchFilesInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchFilesResponse'
 *       409:
 *         description: Conflict
 *       400:
 *         description: Bad request
 */
routes.post('/searchfile', searchFile)



export default routes