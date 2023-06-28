const Accounts = require("../models/Accounts")
const { genDetail, genRandomHeader } = require("../components/generateDetails")
const tryRegister = require("../components/tryRegister")

const Register = async (_, res) => {
    
    try{
        const headers = genRandomHeader()
        const {email, password} = await genDetail()

        const {ref_level, ref_link, ...rest} = (await Accounts.aggregate([
            { $match: {
                ref_level: {
                    $nin: [null, undefined],
                    $lt: 3,
                    // $eq: 1
                },
                ref_link: {$nin: [null, undefined, ""]},
            } },
            { $sample: { size: 1 } }
        ]))[0]
        

        const refEmail = rest.email

        console.log(`Creating account with ${refEmail}'s referral code`)

        const refCode = ref_link.split('/').pop()
        console.log('Ref Code:', refCode)

        const regResponse = await tryRegister(email, password, refCode, headers)

        if(!regResponse){
            return res.json({
                success: false,
                message: 'Registration not successful'
            })
        }

        const newAcct = await Accounts.create({
            email: email,
            password: password,
            last_task_done: new Date(Date.now() - 24 * 60 * 60 * 1000),
            balance: 0,
            reg_date: new Date(),
            ref_level: ref_level + 1,
            working: false
        })
        console.log(newAcct)

        res.json({
            success: true,
            new_acct: newAcct
        })
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
        
    }
}

module.exports = Register