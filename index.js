require('dotenv').config()
const express = require('express')
const app = express()
const KeepAppAlive = require('./routes/KeepAppAlive')
const Accounts = require('./models/Accounts')
const connectToDB = require('./config/dbConnect')
const Login = require('./routes/Login')
const Register = require('./routes/Register')


connectToDB()


app.use(express.urlencoded({ extended: true }))


app.get('/', KeepAppAlive)

app.get('/login', Login)

app.get('/register', Register)


// app.get('/test', async (_, res) => {
//   try{
//     const emails = [
//       'suleimananikulapo@yahoo.com',
//       'igbofalade86@gmail.com',
//       'ezeojukwu26@gmail.com',
//       'patienceemeka69@gmail.com',
//       'idowuadeyemi57@yahoo.com',
//       'ngozimustapha76@gmail.com',
//       'uzomauwais47@gmail.com',
//       'abdulahikalu54@gmail.com',
//       'akpanoshodi74@gmail.com',
//       'nwabuezeabdullahi29@gmail.com',
//       'nwabuezekalu21@gmail.com',
//       'suleimanfashola63@yahoo.com',
//       'adaezeakintola13@gmail.com',
//       'chukwuemekaokoye@yahoo.com',
//       'zeinablai@yahoo.com',
//     ]
//     const documents = emails.map(email => ({
//       email: email,
//       password: 'PrAnnie_2018',
//       last_task_done: new Date(Date.now() - 24 * 60 * 60 * 1000),
//       balance: 0,
//       reg_date: new Date(),
//       working: false
//     }))

//     const filteredDocuments = (await Promise.all(
//       documents.map(async (document) => {
//         const existingAccount = await Accounts.findOne({ email: document.email });
//         return existingAccount ? null : document;
//       })
//     )).filter((document) => document !== null );
//     const result = await Accounts.insertMany(filteredDocuments)



//     res.json({
//       success: true,
//       result: result
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

