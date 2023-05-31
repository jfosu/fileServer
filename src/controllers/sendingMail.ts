import express, { Application, Request, Response, NextFunction} from 'express'
import transporter from '../utils/mailer'
import pool from '../dbConfig/db'
import userInfo from '../types/userInfo'



const isFileInSession = (sent_files: any, id: string) => {
    for(let i: number =0; i<sent_files.length; i++) {
        if(sent_files[i].file_id == id) {
            sent_files[i].nunmerOfSentFiles += 1
            return true
        }
    }
    return false
}


const sendingMail = (req: Request, res: Response) => {
    const { to, subject, body, file_id, filename, description, myfile } = req.body
    if (!to || !subject) {
        req.flash('success_msg', 'File could not be delivered, no mail address provided!')
        res.redirect('/dashboard')
        // res.status(400).json({error_msg: 'Please provide mail address'})
    }
    const path = 'public\\uploads\\' + myfile
    const nunmerOfSentFiles = 1
    const user = req.user as userInfo
    const { user_id, user_email } = user
    console.log(to, subject, body, path, file_id, filename, description, myfile)
    
    const fileData = {
        user_id,
        user_email,
        file_id,
        myfile,
        nunmerOfSentFiles
    }

    if(req.session.sent_files !== undefined) {
        const sent_files = req.session.sent_files

        if(!isFileInSession(sent_files, file_id)) {
            sent_files.push(fileData)
            
        }
    }else {
        req.session.sent_files = [fileData]
        const sent_files = req.session.sent_files
    }
    let results = req.session.sent_files
    console.log('No. mail sent...', results)
    for(let i: number = 0; i<results.length; i++) {
        pool.query(`INSERT INTO mails_sent (mails_sent_id, user_id, user_email, file_id, image, number_of_sent_files)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (file_id)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          mails_sent_id = EXCLUDED.mails_sent_id,
          user_email = EXCLUDED.user_email,
          image = EXCLUDED.image,
          number_of_sent_files = EXCLUDED.number_of_sent_files
        WHERE mails_sent.file_id = EXCLUDED.file_id        
        RETURNING *`, [results[i].user_id, results[i].user_id, results[i].user_email, results[i].file_id, results[i].myfile, results[i].nunmerOfSentFiles], (err, result) => {
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
       // res.status(500).json({error_msg: 'Something went wrong, could send mail with attachment'})
        } else {
          console.log('Email sent: ' + info.response);
          
        }
      });
    
    req.flash('success_msg', 'File has been sent to specified mail address')
    res.redirect('/dashboard')
    // res.status(200).json({'success_msg': 'File has been sent to specified mail address'})
}

export default sendingMail