const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))

app.use(express.static('public'));

//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

//allows us to process post info in urls
app.use(express.urlencoded({extended: false}));

const path = require('path');

//importing our own node module
const users=require('./models/users.js')

//consts to hold expiry times in ms
const threeMins = 1000 * 60 * 3;
const oneHour = 1000 * 60 * 60;

//use the sessions module and the cookie parser module
const sessions = require('express-session');
const cookieParser = require("cookie-parser");

//make cookie parser middleware available
app.use(cookieParser());

//load sessions middleware, with some config
app.use(sessions({
    secret: "a secret that only i know",
    saveUninitialized:true,
    cookie: { maxAge: oneHour },
    resave: false 
}));

require('dotenv').config()
const mongoDBPassword=process.env.MONGODBPASSWORD
const myUniqueDatabase="blogAndrei"

const mongoose=require('mongoose')
const connectionString=`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${myUniqueDatabase}?retryWrites=true&w=majority`
console.log(connectionString)
mongoose.connect(connectionString)

//mongoose.connect(`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/DJWApp?retryWrites=true&w=majority`)​
const postData=require('./models/post-data.js')



//test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction){
    if(request.session){
        if(request.session.userid){
            nextAction()
        } else {
            request.session.destroy()
            return response.redirect('/notloggedin.html')
        }
    }
}

//controller for the main app view, depends on user logged in state
app.get('/app', checkLoggedIn, (request, response)=>{
    response.redirect('./application.html')
})


//controller for logout
app.post('/logout', async (request, response)=>{
    
    // users.setLoggedIn(request.session.userid,false)
    request.session.destroy()
    console.log(await users.getUsers())
    response.redirect('./loggedout.html')
})

//controller for login
app.post('/login', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    console.log(userData)
    if(await users.findUser(userData.username)){
        console.log('user found')
        if(await users.checkPassword(userData.username, userData.password)){
            console.log('password matches')
            request.session.userid=userData.username
            // users.setLoggedIn(userData.username, true)
            response.redirect('/loggedin.html')
        } else {
            console.log('password wrong')
            response.redirect('/loginfailed.html')
        }
    }
    console.log(await users.getUsers())
})


app.post('/newpost',(request, response) =>{
    console.log(request.body)
    console.log(request.session.userid)
    postData.addNewPost(request.session.userid, request.body)
    response.redirect('/postsuccessful.html')
})

app.get('/getposts',async (request, response)=>{
    response.json(
        {posts:await postData.getPosts(5)}
        
    )
})

//controller for registering a new user
app.post('/register', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    // console.log(userData.username)
    if(await users.findUser(userData.username)){
        console.log('user exists')
        response.json({
            status: 'failed',
            error:'user exists'
        })
    } else {
        await users.newUser(userData.username, userData.password)
        response.redirect('/registered.html')
    }
    console.log(await users.getUsers())
})