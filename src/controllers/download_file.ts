import express, { Application, Request, Response, NextFunction} from 'express'
import pool from '../dbConfig/db'

const isFileInCart = (downloads_cart: any, file_id: string) => {
    for(let i: number =0; i<downloads_cart.length; i++) {
        if(downloads_cart[i].file_id == file_id) {
            downloads_cart[i].downloads = parseInt(downloads_cart[i].downloads)
            downloads_cart[i].downloads += 1
            return true
        }
    }
    return false
}



const download_file = (req: Request, res: Response) => {
    let { file_id, filename, description, downloads, mails_sent, myfile } = req.body
    mails_sent = parseInt(mails_sent)
    downloads = parseInt(downloads)

    const path = 'public\\uploads\\' + myfile
    console.log(path, file_id, filename, description, downloads, mails_sent, myfile)
    
    const fileData = {
        file_id,
        filename,
        description,
        downloads,
        mails_sent,
        myfile
    }

    if(req.session.downloads_cart !== undefined) {
        const downloads_cart = req.session.mails_cart

        if(!isFileInCart(downloads_cart, file_id)) {
            downloads_cart.push(fileData)
            
        }
    }else {
        req.session.downloads_cart = [fileData]
        const downloads_cart = req.session.downloads_cart
    }
    console.log('huh!', req.session.downloads_cart)
    let results = req.session.downloads_cart
    console.log('No. mail sent...', results)
    for(let i: number = 0; i<results.length; i++) {
        let id = results[i].file_id
        let downloads = results[i].downloads
        console.log('Both', id,downloads)
        pool.query(`UPDATE files SET downloads = $1 WHERE file_id = $2`, [downloads, id], (err, result) => {
            if (err) {
                throw err
            }
            console.log(result.rows)
        })
    }

    res.download(path, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('File downloaded successfully')
            
        }
    })
}

export default download_file