const ua = require("user-agents")
const Accounts = require("../models/Accounts")
const { genRandomHeader } = require("../components/generateDetails")
const tryLogin = require("../components/tryLogin")
const fetchAcctDetails = require("../components/fetchAcctDetails")
const joinAI = require("../components/joinAI")
const fetchRefCode = require("../components/fetchRefCode")
const changeWorking = require("../components/changeWorkingFalse")


const Login = async (_, res) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const headers = genRandomHeader()
    try{
        const account = (await Accounts.aggregate([
            { $match: {
                last_task_done: {$lt: twentyFourHoursAgo},
                working: false
            } },
            { $sort: {
                ref_level: 1
            } },
            { $sample: { size: 1 } }
        ]))[0]

        if(!account){
            return res.json({
                success: true,
                message: 'No accounts left'
            })
        }

        var {email, password, ref_link} = account
        console.log(email)
        // await Accounts.updateOne({email: email}, {working: true})

        res.json({
            success: true,
            message: 'Passed Job on to axiosss'
        })

        const token = await tryLogin(email, password, headers)

        if(!ref_link){
            const refCode = await fetchRefCode(token, headers)

            await Accounts.updateOne({email: email}, {ref_link: refCode})
            console.log('Gotten referral code for', email)
        }

        const acctDetails = await fetchAcctDetails(token, headers)

        const balance = acctDetails.wallet.balance

        const taskResponse = await joinAI(token, password, balance, headers)
        console.log(taskResponse.msg)
        if(taskResponse.code != 1 && taskResponse.msg === 'Minimum purchase amount exceeded'){
            console.log('Task done already', email)
            return await Accounts.updateOne({email: email}, {last_task_done: new Date()})
        }
        if(taskResponse.code != 1){
            return console.log('Unknown task error occurred')
        }

        await Accounts.updateOne({email: email}, {last_task_done: new Date(), balance: balance})
        return console.log('Task done for', email)



    }
    catch(err){
        try{
            res.status(500).json({
                error: {
                    message: err.message
                }
            })
        }
        catch{
            console.error(err.message)
        }
    }
    finally{
        // await changeWorking(Accounts, email)
    }
}

module.exports = Login