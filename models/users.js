
    const mongoose=require('mongoose')
    const {Schema, model} = mongoose

    const userSchema= new Schema({
        username: String,
        password: String,
        logged: Boolean
    })

    const User = model('DavesUser', userSchema)

    async function newUser(username, password){
        const user={username:username, password:password, loggedin:false}
        // users.push(user)
        await User.create(user)
        .catch(err=>{
            console.log('Error:'+err)
        })
    }

    async function getUsers(){
        // return users
        let data=[]
        await User.find({})
            .exec()
            .then(mongoData=>{
                data=mongoData
            })
            .catch(err=>{
                console.log('Error:'+err)
            })
        return data
    }

    async function findUser(userToFind){
        // return users.find(user=>user.username==username)
        let user=null
        await User.findOne({username:userToFind}).exec()
            .then(dataFromMongo=>{
                user=dataFromMongo
            })
            .catch(err=>{
                console.log('error:'+err)
            })
        return user
    }

    async function checkPassword(username, password){
        let user=await findUser(username)
        if(user){
            return user.password==password
        }
        return false
    }

    function setLoggedIn(username, state){
        let user=findUser(username)
        if(user){
            user.loggedin=state
        }
    }

    function isLoggedIn(username){
        let user=findUser(username)
        if(user){
            return user.loggedin=state
        }
        return false
    }

exports.newUser=newUser;
exports.getUsers=getUsers;
exports.findUser=findUser;
exports.checkPassword=checkPassword;
exports.setLoggedIn=setLoggedIn;
exports.isLoggedIn=isLoggedIn;

