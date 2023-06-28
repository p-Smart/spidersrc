require('dotenv').config()
const express = require('express')
const app = express()
const KeepAppAlive = require('./routes/KeepAppAlive')
const connectToDB = require('./config/dbConnect')
const Login = require('./routes/Login')
const Login2 = require('./routes/Login2')
const Register = require('./routes/Register')
const Register2 = require('./routes/Register2')
const GetRefs = require('./routes/GetRefs')


connectToDB()


app.use(express.urlencoded({ extended: true }))


app.get('/', KeepAppAlive)

app.get('/register', Register2)


app.get('/login', Login2)


app.get('/get-refs', GetRefs)


// app.get('/test', async (_, res) => {
//   try{



//     res.json({
//       success: true,
//       // result: result
//     });
//   }
//   catch(err){
//     res.json({
//       error: {
//         message: err.message
//       }
//     });
//   }
// })






















app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: `You're lost, man!`
      }
    });
    next()
})



app.listen(process.env.PORT || 3000, () => console.log(`Server running...`))

