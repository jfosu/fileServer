import express, { Application, Request, Response, NextFunction} from 'express'
export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.redirect('/my/dashboard')
    }
    next()
    
}

export const checkNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Please log in to view resource')
    res.redirect('/login')
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}