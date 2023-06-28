const axios = require('axios')


const fetchAcctDetails = async (token, headers) => {
    // const formData = new FormData()
    // formData.append('token', token)
    try{
        const {data} = await axios.post(`https://www.spidersrc.com/api/?c=User&a=index`, {}, {headers: {...headers, Token: token}})
        if(data?.code == 1){
            return data.data
        }
        throw new Error('Error fetching user data')
    }
    catch(err){
        if(err.message.includes('connect ETIMEDOUT')){
            return fetchAcctDetails(token, headers)
        }
        throw new Error(err.message)
    }
}

module.exports = fetchAcctDetails