const crypto = require('crypto')
const axios = require('axios')


const joinAI = async (token, password, money, headers) => {
    const formData = new FormData()
    formData.append('gsn', '44dd9db594dcb947')
    formData.append('quantity', '1')
    formData.append('money', money)
    const passwordHash = crypto.createHash('md5').update(password).digest('hex')
    formData.append('password2', passwordHash)

    try{
        const {data} = await axios.post(`https://www.spidersrc.com/api/?c=Product&a=invest`, formData, {headers: {...headers, Token: token}})
        return data
    }
    catch(err){
        if(err.message.includes('connect ETIMEDOUT')){
            return joinAI(token, password, money, headers)
        }
        throw new Error(err.message)
    }
}

module.exports = joinAI