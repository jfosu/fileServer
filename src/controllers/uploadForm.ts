import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'
import multer from 'multer'
import path from 'path'

/**
 * @openapi
 * components:
 *   schemas:
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *       example:
 *         success: true
 *         message: File uploaded successfully
 */


// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// check file type
const checkFileType = (file: any, cb: any) => {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Upload images Only')
    }
}

// Init upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
    }).single('myfile')


export const uploadForm = (req: Request, res: Response) => {

    upload(req, res, (err) => {
        let { filename, description } = req.body
        console.log(req.file, filename, description)
        
        if (err) {
            // res.render('uploadForm', { msg: err })
            res.status(409).json({ msg: err})
        } else {
            if (req.file == undefined) {
                // res.render('uploadForm', { msg: 'Please select a file' })
                res.status(400).json({'error_msg': 'Please select a file'})
            } else {
                pool.query(
                    `INSERT INTO files (title, description, image)
                    VALUES ($1, $2, $3)
                    RETURNING *`, [filename, description, req.file.filename],
                    (err, result) => {
                        if (err) {
                            throw err
                        }
                        console.log(result.rows)
                        // req.flash('success_msg', 'File uploaded successfuly')
                        // res.redirect('/dashboard')
                        res.status(200).json({'success_msg': 'File uploaded successfuly'})
                    }
                )
            }
        }
        
    })
    

}

export default uploadForm