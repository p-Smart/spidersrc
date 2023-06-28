const ua = require("user-agents")
const Accounts = require("../models/Accounts")
const { genRandomHeader } = require("../components/generateDetails")
const tryLogin = require("../components/tryLogin")
const fetchRefCode = require("../components/fetchRefCode")
const changeWorking = require("../components/changeWorkingFalse")


const GetRefs = async (_, res) => {
    const headers = genRandomHeader()
    const newDiscoveryDate = new Date('2023-06-28T11:19:45.736+00:00')
    try{
        const account = (await Accounts.aggregate([
            { $match: {
                working: false,
                ref_link: {$in: [null, undefined, ""],},
                reg_date: {$gt: newDiscoveryDate}
            } },
            { $sample: { size: 1 } }
        ]))[0]

        if(!account){
            return res.json({
                success: true,
                message: 'No accounts left'
            })
        }

        var {email, password} = account
        console.log(account)
        console.log(email)
        await Accounts.updateOne({email: email}, {working: true})

        res.json({
            success: true,
            message: 'Passed Job on to axiosss'
        })

        const token = await tryLogin(email, password, headers)

        const refCode = await fetchRefCode(token, headers)

        await Accounts.updateOne({email: email}, {ref_link: refCode})
        console.log('Gotten referral code for', email)

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
        await changeWorking(Accounts, email)
    }
}

module.exports = GetRefs