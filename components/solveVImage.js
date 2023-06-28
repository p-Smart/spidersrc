const axios = require('axios')
const Tesseract = require('tesseract.js')


const tryTesseract = async (buffer, tries=0) => {
    console.log('Trying tryTesseract', tries, 'time(s)')
    if(tries > 2){
        throw new Error('Too many errors, try later')
    }

    const {data} = await Tesseract.recognize(buffer, 'eng')
    const vCode = (data.text).match(/\d{4}/)?.[0] || ''

    if(!vCode){
        return await tryTesseract(buffer, ++tries)
    }

    return vCode
}


const solveVImage = async (url, tries=0) => {
    try{
        console.log('Trying solveVImage', tries, 'time(s)')
        if(tries > 2){
            throw new Error('Too many errors, try later')
        }


        const { data: jsonResponse } = await axios.get(url, {
            responseType: 'json',
        })
        
        if(jsonResponse?.msg === 'Verification code has expired'){
            return false
        }
        const { data: bufferResponse } = await axios.get(url, {
            responseType: 'arraybuffer',
        })
    
        const vCode = await tryTesseract(bufferResponse)
    
        return {
            vCode: vCode,
            buffer: bufferResponse
        }
    }
    catch(err){
        if(err.message.includes('connect ETIMEDOUT')){
            return solveVImage(url, ++tries)
        }
        throw new Error(err.message)
    }
}


module.exports = solveVImage