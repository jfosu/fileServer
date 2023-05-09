import express, { Application, Request, Response, NextFunction} from 'express'
import transporter from '../utils/sendMail'
import pool from '../dbConfig/db'

/**
 * @openapi
 * components:
 *   schemas:
 *     FileEmailRequest:
 *       type: object
 *       required:
 *         - to
 *         - subject
 *         - body
 *         - filePath
 *       properties:
 *         to:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         subject:
 *           type: string
 *           example: logo as specified
 *         body:
 *           type: string
 *           example: find attach file as requested
 *         filePath:
 *           type: string
 *           format: file-path
 *           example: /path/to/myfile.png
 *     FileEmailResponse:
 *       type: object
 *       properties:
 *         success_msg:
 *           type: string
 *           description: A success message indicating that the file was sent successfully.
 */


const isFileInCart = (mails_cart: any, file_id: string) => {
    for(let i: number =0; i<mails_cart.length; i++) {
        if(mails_cart[i].file_id == file_id) {
            mails_cart[i].mails_sent = parseInt(mails_cart[i].mails_sent)
            mails_cart[i].mails_sent += 1
            return true
        }
    }
    return false
}


const mail_form_sent = (req: Request, res: Response) => {
    let { to, subject, body, file_id, filename, description, downloads, mails_sent, myfile } = req.body
    mails_sent = parseInt(mails_sent)
    downloads = parseInt(downloads)

    const path = 'public\\uploads\\' + myfile
    console.log(to, subject, body, path, file_id, filename, description, downloads, mails_sent, myfile)
    
    const fileData = {
        to,
        subject,
        body,
        file_id,
        filename,
        description,
        downloads,
        mails_sent,
        myfile
    }

    if(req.session.mails_cart !== undefined) {
        const mails_cart = req.session.mails_cart

        if(!isFileInCart(mails_cart, file_id)) {
            mails_cart.push(fileData)
            
        }
    }else {
        req.session.mails_cart = [fileData]
        const mails_cart = req.session.mails_cart
    }
    console.log('huh!', req.session.mails_cart)
    let results = req.session.mails_cart
    console.log('No. mail sent...', results)
    for(let i: number = 0; i<results.length; i++) {
        let id = results[i].file_id
        let mailSent = results[i].mails_sent
        console.log('Both', id,mailSent)
        pool.query(`UPDATE files SET mails_sent = $1 WHERE file_id = $2`, [mailSent, id], (err, result) => {
            if (err) {
                throw err
            }
            console.log(result.rows)
        })
    }
    

    const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: to,
        subject: subject,
        text: body,
        attachments: [
            {
                path: path
            }
        ]
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
       console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          // do something useful
        }
      });
    
    // req.flash('success_msg', 'File has been sent to specified mail address')
    // res.redirect('/dashboard')
    res.status(200).json({'success_msg': 'File has been sent to specified mail address'})
}

export default mail_form_sent