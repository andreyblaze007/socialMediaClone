
const mongoose=require('mongoose')
const {Schema, model} = mongoose
const userSchema = new Schema({
    username: String,
    password: String,
    loggedin: Boolean
})

const bcrypt=require('bcrypt')
const SALT_WORK_FACTOR=10


userSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = model('MyDemoUser', userSchema)

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
    let users=[]
    await User.find({}).exec()
        .then(dataFromMongo =>{
            users=dataFromMongo
        })
        .catch(err=>{
            console.log('Error:'+err)
        })
    return users
}

async function findUser(userToFind){
    let foundUser=null
    await User.findOne({username: userToFind}).exec()
        .then(mongoData =>{
            foundUser=mongoData
        })
        .catch(err=>{
            console.log('Error:'+err)
        })
    return foundUser
}

async function checkPassword(username, password, action){
    let user=await findUser(username)
    if(user){
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                action(isMatch)
            })
            .catch(err =>{
                throw err
            })
    }
    return false
}

exports.newUser=newUser;
exports.getUsers=getUsers;
exports.findUser=findUser;
exports.checkPassword=checkPassword;

