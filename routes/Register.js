const Accounts = require("../models/Accounts")
const { genDetail } = require("../components/generateDetails")
const connToPuppeteer = require("../config/pupConnect")

const delay = {delay: 0}
const Register = async (_, res) => {
    
    try{
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
        
        var {browser, page} = await connToPuppeteer()

        await page.goto(ref_link)
        console.log('page loaded')

        await Promise.all([
            page.waitForSelector(`input#van-field-1-input`),
            page.waitForSelector(`input#van-field-2-input`),
            page.waitForSelector(`button`),
        ])
        console.log('Done waiting for selectors')

        await page.evaluate((email, password) => {
            const emailInput = document.querySelector('input#van-field-1-input');
            const passwordInput = document.querySelector('input#van-field-2-input');
          
            emailInput.value = email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          
            passwordInput.value = password;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
          }, email, password);
          
        console.log('Done typing')

        await page.evaluate( () => document.querySelector('button').click() )
        console.log('Register button clicked, waiting for popup')

        await page.waitForFunction(() => {
            const popup = document.querySelector('.van-popup')
            if(popup){
                return popup.style.display !== 'none'
            }
            return false
        })

        const result = await page.evaluate( () => document.querySelector('.van-popup').textContent )
        console.log(result)

        if(result !== 'Register was successful'){
            return res.json({
                error: {
                    message: result
                }
            })
        }

        const response = await Accounts.create({
            email: email,
            password: password,
            last_task_done: new Date(Date.now() - 24 * 60 * 60 * 1000),
            balance: 0,
            reg_date: new Date(),
            ref_level: ref_level + 1,
            working: false
        })
        console.log(response)

        res.json({
            success: true,
            new_acct: response
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
        await page?.close()
        await browser?.close()
    }
}

module.exports = Register