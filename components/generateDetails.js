const fs = require('fs')
const Accounts = require('../models/Accounts');

const genPassword = (firstName, lastName) => `${firstName.slice(0, 2)}${lastName.slice(-2)}${Math.floor(Math.random() * 9000 + 1000)}`;

let firstNames = ['Abdulahi', 'Adaeze', 'Adeola', 'Adesuwa', 'Ahmed', 'Aisha', 'Akpan', 'Amara', 'Anuoluwa', 'Ayomide', 'Bello', 'Chiamaka', 'Chioma', 'Chukwuemeka', 'Daniel', 'Ebere', 'Efe', 'Ego', 'Emeka', 'Esther', 'Folake', 'Funke', 'Ganiyu', 'Hassan', 'Ifunanya', 'Ikechukwu', 'Ireti', 'Isaiah', 'Jemima', 'Kehinde', 'Lanre', 'Mariam', 'Mojisola', 'Ngozi', 'Nkem', 'Obinna', 'Ogechi', 'Olumide', 'Onyinyechi', 'Osaze', 'Patience', 'Rashidat', 'Sadiq', 'Segun', 'Suleiman', 'Temitope', 'Uche', 'Uchenna', 'Ugochi', 'Victor', 'Yakubu', 'Yusuf', 'Zainab', 'Zara', 'Zeinab', 'Zainabu', 'Zainat', 'Zaraatu', 'Zulai', 'Zuleikha', 'Zuwaira', 'Zuwairatu', 'Zuwena', 'Adams', 'Agwu', 'Akpan', 'Aminu', 'Ayodele', 'Babatunde', 'Bello', 'Danjuma', 'Ekechukwu', 'Ekwuazi', 'Eze', 'Idowu', 'Ifeanyi', 'Igbo', 'Igwe', 'Ike', 'Ikeh', 'Ilozumba', 'Iwu', 'Kalu', 'Kwame', 'Lai', 'Lawani', 'Mbachu', 'Nwabueze', 'Nwadiogbu', 'Ogunlana', 'Ojo', 'Okagbue', 'Okoli', 'Okonkwo', 'Oladele', 'Olaleye', 'Olowu', 'Onuigbo', 'Onwuzurike', 'Opara', 'Ozoemena', 'Salami', 'Ugwu', 'Ukaegbu', 'Uzoma', 'Zakari', 'Zubair'];
let lastNames = ['Abdullahi','Ajayi', 'Atanda', 'Ayodele', 'Azeez', 'Bello', 'Chukwu', 'Danjuma', 'Ekezie', 'Eze', 'Falade','Fashola', 'Gbadamosi', 'Idowu', 'Ilori', 'Johnson', 'Kalu', 'Lawal', 'Malik', 'Mustapha', 'Nnadi','Odusanya', 'Ogundele', 'Ojo', 'Okunola', 'Opara', 'Oshodi', 'Salami', 'Sanusi', 'Sodiq', 'Taiwo','Umeh', 'Uzor', 'Williams', 'Yusuf', 'Adebayo', 'Adeyemi', 'Akintola', 'Akinyemi', 'Akpabio', 'Bassey','Effiong', 'Igbinedion', 'Ojukwu', 'Oni', 'Oviasogie', 'Soludo', 'Azikiwe', 'Awolowo', 'Ezeife','Kalu', 'Okonkwo', 'Uwais', 'Zik', 'Akinwunmi', 'Osinkolu', 'Abayomi', 'Oluwaseun', 'Adeosun','Adeniyi', 'Adeolu', 'Agbaje', 'Akindele', 'Amadi', 'Anikulapo', 'Balogun', 'Chukwuma', 'Duru', 'Egwu', 'Ejiofor', 'Eke', 'Ekwueme', 'Emeka', 'Ibe', 'Ibrahim', 'Idris', 'Igwe', 'Ijeoma', 'Ikechukwu', 'Ikenwa', 'Iloka', 'Jaja', 'Kalu', 'Lawal', 'Madu', 'Mbah', 'Nwachukwu', 'Nwadike', 'Nwosu', 'Obi', 'Odeyemi', 'Odum', 'Ogunbiyi', 'Okafor', 'Okoro', 'Okoye', 'Ola', 'Olawale', 'Olowo', 'Onu', 'Onwuka', 'Opara', 'Oti', 'Owolabi', 'Oyekanmi', 'Oyelade', 'Salisu', 'Uba', 'Ugwu', 'Uzoma', 'Yusuf', 'Zubairu', 'Adams', 'Agwu', 'Akpan', 'Aminu', 'Ayodele', 'Babatunde', 'Bello', 'Danjuma', 'Ekechukwu', 'Ekwuazi', 'Eze', 'Ibrahim', 'Idowu', 'Ifeanyi', 'Igbo', 'Igwe', 'Ike', 'Ikeh', 'Ilozumba', 'Iwu', 'Kalu', 'Kwame', 'Lai', 'Lawani', 'Mbachu', 'Nwabueze', 'Nwadiogbu', 'Nwosu', 'Ogunlana', 'Ojo', 'Okagbue', 'Okoli', 'Okonkwo', 'Oladele', 'Olaleye', 'Olowu', 'Onuigbo', 'Onwuzurike', 'Opara', 'Ozoemena', 'Salami', 'Ugwu', 'Ukaegbu', 'Uzoma', 'Yusuf', 'Zakari', 'Zubair'];


// let domainsNExtensions = [
// 	"@cevipsa.com",
// 	"@cpav3.com",
// 	"@nuclene.com",
// 	"@steveix.com",
// 	"@mocvn.com",
// 	"@tenvil.com",
// 	"@tgvis.com",
// 	"@amozix.com",
// 	"@anypsd.com",
// 	"@maxric.com",
//     "@maildrop.cc"
// ]

let domainsNExtensions = ['@gmail.com', '@yahoo.com']

const genDetail = async () => {
    let firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    let lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    let domainNExtension = domainsNExtensions[Math.floor(Math.random() * domainsNExtensions.length)]
    let randomNumbers = (['',Math.floor(Math.random() * 90) + 10, Math.floor(Math.random() * 900) + 100, Math.floor(Math.random() * 9000) + 100, Math.floor(Math.random() * (new Date().getFullYear() - 1980 + 1)) + 1980])
    let randomNumber = randomNumbers[Math.floor(Math.random() * randomNumbers.length)]
    let email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}${domainNExtension}`

    const duplicate = await Accounts.findOne({ $or: [{ email: email }] });
    if (duplicate){
        return genDetail()
    }

    return {
        email: email,
        password: 'PrAnnie_2018',
    }
} 


module.exports = {
    genDetail: genDetail,
}