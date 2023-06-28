const fs = require('fs')
const Accounts = require('../models/Accounts');
const RandomDetails = require('../models/RandomDetails');
const ua = require("user-agents")

const genIp = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');

const generateRandomIps = count => Array.from({ length: count }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')).join(', ')

const genUserAgent = () => new ua().toString().replace(/\/[^/]* (?=[^ ]*$)/, `/${genIp()} `)

const genRandomHeader = () => ({
    "User-Agent": genUserAgent(),
    "X-Forwarded-For": generateRandomIps(2),
    "Host": 'www.spidersrc.com',
    "Origin": 'https://www.spidersrc.com',
    "Cookie": 'domain=spidersrc.com; path=/'
})

const genDetail = async () => {
    const {user_email} = (await RandomDetails.aggregate([
        {$match: { }},
        { $sample: { size: 1 } }
    ]))[0]
    const email = user_email

    const duplicate = await Accounts.findOne({ $or: [{ email: email }] });
    if (duplicate){
        return genDetail()
    }
    await RandomDetails.deleteOne({user_email: email})

    return {
        email: email,
        password: 'PrAnnie_2018',
    }
} 


module.exports = {
    genDetail: genDetail,
    genRandomHeader: genRandomHeader
}