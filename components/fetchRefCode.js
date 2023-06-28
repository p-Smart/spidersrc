const axios = require('axios')


const fetchRefCode = async (token, headers) => {
    try{
        const {data} = await axios.post(`https://www.spidersrc.com/api/?c=Share&a=index`, {}, {headers: {...headers, Token: token}})
        if(data?.code == 1){
            return data.data.url
        }
        throw new Error('Error getting referral code')
    }
    catch(err){
        if(err.message.includes('connect ETIMEDOUT')){
            return fetchRefCode(token, headers)
        }
        throw new Error(err.message)
    }
}

module.exports = fetchRefCode