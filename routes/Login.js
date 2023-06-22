const ua = require("user-agents")
const Accounts = require("../models/Accounts")
const connToPuppeteer = require("../config/pupConnect")
const Tesseract = require('tesseract.js')
const fs = require('fs')

const getVerificationCode = async (page, delay) => {
    const result = 
    await page.evaluate( () => {
        if(document.querySelector(`input#van-field-3-input`)){
            document.querySelector(`input#van-field-3-input`).value = ''
            return true
        }
        return false
    } )
    if(!result){
        return
    }

    await page.click('.van-field__right-icon')
    await page.waitForTimeout(500)
    await page.waitForFunction( () => document.querySelector('.van-field__right-icon .van-image__img').complete === true )
    await page.waitForTimeout(1000)
    const imageData = await page.screenshot({
        type: 'png',
        encoding: 'binary',
    })
    const {data} = await Tesseract.recognize(imageData, 'eng')
    const verificationCode = (data.text).match(/\d{4}(?=\nRegister new account)/)?.[0] || ''
    if(!verificationCode){
        return await getVerificationCode(page, delay)
    }
    console.log('Verification code:', verificationCode)
    return await page.evaluate((verificationCode, password) => {
        const codeInput = document.querySelector('input#van-field-3-input');
      
        codeInput.value = verificationCode;
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      }, verificationCode);
}

const verifyAndLogin = async (page, count=0) => {
    if(count === 3){
        throw new Error('Too many verification code errors')
    }
    await getVerificationCode(page, delay)
    await page.click('button')
    raceResult = 
    await Promise.race([
        page
        .waitForFunction(() => {
            const popup = document.querySelector('.van-popup')
            if(popup){
                return popup.style.display !== 'none' && popup.textContent !== 'Login success'
            }
            return popup !== null
        })
        .then(async () => {
            return 'Error';
        }),
        page
        .waitForFunction(() => {
            const popup = document.querySelector('.van-popup')
            if(popup){
                return popup.style.display !== 'none' && popup.textContent === 'Login success'
            }
            return popup !== null
        })
    ])
    console.log(  await page.evaluate( () => document.querySelector('.van-popup').textContent )  )
    if(raceResult === 'Error'){
        return await verifyAndLogin(page, ++count)
    }
}


const waitForTaskPage = async (page, count=0) => {
    try{
        count !== 0 && await page.reload()
        await page.waitForFunction( () => {
            const button = document.querySelector('.projectDet_bot')
            if(button){
                return button.textContent === 'Join AI'
            }
            return false
        }, {timeout: 5000} )
    }catch(err){
        await waitForTaskPage(page, ++count)
    }
}

const changeWorking = async (Accounts, email) => {
    try{
        await Accounts.updateOne({email: email}, {working: false})
    }
    catch(err){
        await changeWorking(Accounts)
    }
}



const delay = {delay: 10}
const Login = async (_, res) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    try{
        const account = (await Accounts.aggregate([
            { $match: {
                last_task_done: {$lt: twentyFourHoursAgo},
                working: false
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
        console.log(email)
        await Accounts.updateOne({email: email}, {working: true})

        res.json({
            success: true,
            message: 'Job passed on to puppeteer'
        })

        var {browser, page} = await connToPuppeteer()
        console.log('Browser loaded')

        await page.goto(`https://www.spidersrc.com/h5/login`, { waitUntil: 'networkidle0' })
        await page.waitForFunction( () => !document.querySelector('.van-overlay') || document.querySelector('.van-overlay').style.display === 'none' )
        console.log('Signup page loaded')

        await page.waitForSelector('.van-image__img')

        await page.evaluate((email, password) => {
            const emailInput = document.querySelector('input#van-field-1-input');
            const passwordInput = document.querySelector('input#van-field-2-input');
          
            emailInput.value = email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          
            passwordInput.value = password;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
          }, email, password);
          console.log('Typed details')


        await verifyAndLogin(page)
        await page.setRequestInterception(true);

        page.on('request', (request) => {
          if (request.resourceType() === 'image') {
            request.abort();
          } else {
            request.continue();
          }
        });
        console.log('Logged in')

        await page.goto(`https://www.spidersrc.com/h5/product/goods/44dd9db594dcb947`, { waitUntil: 'networkidle0' })
        console.log('Gone to Task page')

        await waitForTaskPage(page)
        await page.waitForFunction( () => !document.querySelector('.van-overlay') || document.querySelector('.van-overlay').style.display === 'none' )
        

        await page.evaluate( () => document.querySelector('.projectDet_bot button').click() )

        await page.waitForFunction( () => document.querySelector('.van-popup')?.style?.display !== 'none' )
        console.log('Task purchase modal opened')

        const balance = await page.evaluate( () => document.querySelector('.van-grid-item__content span').textContent.match(/\d+\.\d+/)?.[0] )

        if(balance == '0.00'){
            console.log('Task done already', email)
            return await Accounts.updateOne({email: email}, {last_task_done: new Date()})
        }

        await page.evaluate((amount, password) => {
            const amountInput = document.querySelector('input:first-child');
            const passwordInput = document.querySelector('input:last-child');
          
            amountInput.value = amount;
            amountInput.dispatchEvent(new Event('input', { bubbles: true }));
          
            passwordInput.value = password;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        }, balance, password);

        await page.evaluate( () => document.querySelectorAll('button')[1].click() )

        await page.waitForFunction( () => document.querySelectorAll('.van-popup')[1] && document.querySelectorAll('.van-popup')[1].textContent === 'Successful purchase' )

        await Accounts.updateOne({email: email}, {last_task_done: new Date(), balance: balance})
        console.log('Task done for', email)

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
        await changeWorking(Accounts, email)
    }
}

module.exports = Login