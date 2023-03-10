import express, { Application, Request, Response, NextFunction} from 'express'
import hRoutes from './routes/index';
import uRoutes from './routes/users';
import expressLayout from 'express-ejs-layouts'

const app: Application = express()

// EJS
app.use(expressLayout)
app.set('view engine', 'ejs')


// Routes
app.use('/', hRoutes)
app.use('/users', uRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on  ${PORT}`)
});