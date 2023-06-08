import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import userInfo from '../types/userInfo'
import path from 'path'

const isFileInSession = (downloaded_files: any, id: string) => {
    for(let i: number =0; i<downloaded_files.length; i++) {
        if(downloaded_files[i].file_id == id) {
            downloaded_files[i].numberOfDownloadedFiles += 1
            return true
        }
    }
    return false
}



const downloadFile = (req: Request, res: Response) => {
    const user = req.user as userInfo
    const { user_id, user_email} = user
    let { file_id, filename, description, myfile } = req.body
    const numberOfDownloadedFiles = 1

    const attachmentPath = path.join(__dirname, '../public/uploads', myfile);

    console.log(attachmentPath, file_id, filename, description)
    
    const fileData = {
        user_id,
        user_email,
        file_id,
        myfile,
        numberOfDownloadedFiles
    }

    if(req.session.downloaded_files !== undefined) {
        const downloads_cart = req.session.downloaded_files

        if(!isFileInSession(downloads_cart, file_id)) {
            downloads_cart.push(fileData)
            
        }
    }else {
        req.session.downloaded_files = [fileData]
        const downloads_cart = req.session.downloaded_files
    }
    console.log('huh!', req.session.downloaded_files)
    let results = req.session.downloaded_files
    console.log('No. mail sent...', results)
    for(let i: number = 0; i<results.length; i++) {
        pool.query(`INSERT INTO downloads (downloaded_files_id, user_id, user_email, file_id, image, number_of_downloaded_files)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (file_id)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          downloaded_files_id = EXCLUDED.downloaded_files_id,
          user_email = EXCLUDED.user_email,
          image = EXCLUDED.image,
          number_of_downloaded_files = EXCLUDED.number_of_downloaded_files
        WHERE downloads.file_id = EXCLUDED.file_id        
        RETURNING *`, [results[i].user_id, results[i].user_id, results[i].user_email, results[i].file_id, results[i].myfile, results[i].numberOfDownloadedFiles], (err, result) => {
            if (err) {
                throw err
            }
            console.log(result.rows)
        })
    }

    res.download(attachmentPath, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('File downloaded successfully')
            
        }
    })
}

export default downloadFile