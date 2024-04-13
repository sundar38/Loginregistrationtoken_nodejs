const express= require("express")
const { cleanUpandValidate } = require("./utils/AuthUtils")
const app=express()
const validator = require("validator")
const PORT= process.env.PORT || 8000
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

app.get("/", (req,res)=>{
    return res.send("This is your todo app")
})
app.get("/login", (req, res)=>{
    return res.render("login")
})
app.get("/register", (req, res)=>{
    return res.render("register")
})
app.post("/login",async (req, res)=>{
    console.log(req.body)
    //validate the data with validator
    const {loginId, password}= req.body
    if(!loginId || !password || typeof(loginId)!="string"){
        return res.send({
            status: 401,
            message: "fill all fields properly"           
        })
    }

    let userDb //First here in  loginid field user can enter mailid or username so from db we  need to  
    // search whether the entered value is username or email. if we have the user in db this variable will stores that data from mongodb

    //searching whether the entered data is username or email
    if(validator.isEmail(loginId)) //if the logingid-we entered is email
    {
        userDb= await userSchema.findOne({ email: loginId}) //searches whole users with email : the entered value
    }
    else{
        userDb= await userSchema.findOne({username: loginId}) //as logind is not email it is username now we are telling db with search by username field
        // newly entered value in logid field
    }

    if(!userDb){ //if the value itself does not exist in db
        return res.send({
            status: 401,
            message: "user doesnot exists.please register again"
        })
    }
    //now compare the userdb.password(hashed pw) with req.password(user entered one in form)
    const isMatch= await bcrypt.compare(password, userDb.password) //using compare f() to compare both hashed- from db to normal pw
    if(!isMatch){
        return res.send({
            status: 401,
            message: "incorrect password"
        })
    }

    return res.send({
        status: 200,
        message: "user loggedin successfully",
        data: req.body
    })
})
app.post("/register", async(req, res)=>{
    console.log(req.body)
    //validate the data
    const {name, email, username, password}=req.body
    try{       
        await cleanUpandValidate({name, email, username, password})
    }
    catch(error){
        return res.send({
            status: 402,
            message: error,
        })

    }
    // return res.send({
    //     status: 200,
    //     message: "user registered successfully",
    //     data: req.body
    // })
    return res.status(200).redirect("/login") //as user successfully registered instead of showing
    //success msg we are making user to redirect to login page
})


app.listen(PORT, ()=>{
    console.log("Server is running at 8000 port")
})

