const crypto = require('crypto')
const axios = require('axios')


const tryRegister = async (email, password, ref_code, headers, tries=0) => {
    try{
        if(tries > 4){
            throw new Error('Too many errors, try later')
        }
        const {data: vCodeResponse} = await axios.post(`https://www.spidersrc.com/api/?a=getVcode`, {}, {headers: headers})

        if(vCodeResponse.msg !== 'ok'){
            throw new Error('Error getting verification URL')
        }

        const vImageUrl = vCodeResponse.data.url
        const sessionId = vCodeResponse.data.session_id

        const formData = new FormData()
        formData.append('type', '2')
        formData.append('sid', sessionId)
        formData.append('account', email)
        formData.append('area_code', '1')
        formData.append('email', '')
        const passwordHash = crypto.createHash('md5').update(password).digest('hex')
        formData.append('password', passwordHash)
        formData.append('password_flag', password)
        formData.append('icode', ref_code)
        formData.append('ecode', '')
        formData.append('scode', '')
        formData.append('vcode', '')
        formData.append('imgcode', '')
        formData.append('imgcode_url', vImageUrl)

        
        const {data: regResponse} = await axios.post(`https://www.spidersrc.com/api/?a=registerAct`, formData, {headers: headers})
        console.log(regResponse)

        console.log(regResponse?.msg)
        if(regResponse?.code != 1){
            return false
        }
        return true
    }
    catch(err){
        if(err.message.includes('connect ETIMEDOUT')){
            return tryRegister(email, password, ref_code, headers, ++tries)
        }
        throw new Error(err.message)
    }
}

module.exports = tryRegister