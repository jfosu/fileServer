import express, { Application, Request, Response, NextFunction} from 'express'
import transporter from '../utils/sendMail'
import pool from '../dbConfig/db'


const isFileInCart = (cart: any, file_id: string) => {
    for(let i: number =0; i<cart.length; i++) {
        if(cart[i].file_id == file_id) {
            cart[i].mails_sent = parseInt(cart[i].mails_sent)
            cart[i].mails_sent += 1
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

    if(req.session.cart !== undefined) {
        const cart = req.session.cart

        if(!isFileInCart(cart, file_id)) {
            cart.push(fileData)
            
        }
    }else {
        req.session.cart = [fileData]
        const cart = req.session.cart
    }
    console.log('huh!', req.session.cart)
    let results = req.session.cart
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
    
    req.flash('success_msg', 'File has been sent to specified mail address')
    res.redirect('/dashboard')
}

export default mail_form_sent