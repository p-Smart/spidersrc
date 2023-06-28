const crypto = require('crypto')
const axios = require('axios')
const solveVImage = require('./solveVImage')



const tryVerifyCode = async (email, passwordHash, vCode, buffer, sessionId, headers) => {
    console.log('Trying vCode:', vCode)
    
    const formData = new FormData()
    formData.append('type', '2')
    formData.append('account', email)
    formData.append('area_code', '1')
    formData.append('password', passwordHash)
    formData.append('sid', sessionId)
    formData.append('vcode', vCode)

    const {data: loginResponse} = await axios.post(`https://www.spidersrc.com/api/?a=login`, formData, {headers: headers})
    
    if(loginResponse.msg === 'Incorrect graphic verification code' || loginResponse.msg === 'Verification code has expired'){
        return false
    }
    
    if(loginResponse?.data?.token){
        console.log(loginResponse.msg)
        return loginResponse.data.token
    }
    console.log(loginResponse)
    throw new Error('Unknown Login Error')
}


const tryLogin = async (email, password, headers, tries=0) => {
    try{
        console.log('Trying login', tries, 'time(s)')
        if(tries > 2){
            throw new Error('Too many errors, try later')
        }

        
        const {data: vCodeResponse} = await axios.post(`https://www.spidersrc.com/api/?a=getVcode`, {}, {headers: headers})

        if(vCodeResponse.msg !== 'ok'){
            throw new Error('Error getting verification URL')
        }

        const vImageUrl = vCodeResponse.data.url
        const sessionId = vCodeResponse.data.session_id

        const passwordHash = crypto.createHash('md5').update(password).digest('hex')

        const {vCode, buffer} = await solveVImage(vImageUrl)

        const token = await tryVerifyCode(email, passwordHash, vCode, buffer, sessionId, headers)

        if(!token){
            return tryLogin(email, password, headers, ++tries)
        }
        return token
    }
    catch(err){
        if(err.message.includes('connect ETIMEDOUT')){
            return tryLogin(email, password, headers, ++tries)
        }
        throw new Error(err.message)
    }
}

module.exports = tryLogin