const express=require('express')
const app=express()

const utils=require('./utils.js')
console.log(utils.addTen(10));

app.listen(3000, ()=> console.log('listening on port 3000'))

app.use(express.static('./public'))

app.use(express.urlencoded({extended: false}))

app.post('/iamsendingapost', (request, response)=> {
    console.log(request.body)
    // console.log("the new post message is: "+request.body.message)
    // console.log("the other thing is: "+request.body.otherthing)
    response.redirect('gotpost.html')
})