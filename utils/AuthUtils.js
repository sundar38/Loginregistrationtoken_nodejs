const validator= require("validator")
const cleanUpandValidate=({name, email, username, password})=>{
    return new Promise((resolve, reject)=> {
        if(!name || !email || !username || !password) reject("Fields are blank")
        if(typeof name !== "string") reject("wrong name")
        if(typeof email !== "string") reject("wrong email")
        if(typeof username !== "string") reject("wrong username")
        if(typeof password !== "string") reject("wrong password")
        if(name.length< 2 ) reject("name is very small")      
        if(!validator.isEmail(email)) reject("Invalid email format")
        resolve()
    })
}
module.exports=({ cleanUpandValidate })