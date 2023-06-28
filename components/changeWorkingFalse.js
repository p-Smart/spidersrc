


const changeWorking = async (Accounts, email) => {
    try{
        await Accounts.updateOne({email: email}, {working: false})
    }
    catch(err){
        await changeWorking(Accounts)
    }
}

module.exports = changeWorking