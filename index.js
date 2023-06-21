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
//       'anuoluwababatunde48@mocvn.com',
//       'nkemadams40@amozix.com',
//       'okagbueikeh93@tenvil.com',
//       'okonkwookagbue66@steveix.com',
//       'sadiqolawale97@amozix.com',
//       'kaluadeolu77@tgvis.com',
//       'adeoladuru46@tenvil.com',
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

