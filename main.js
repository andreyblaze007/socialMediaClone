let posts=[]

let postButton=document.getElementById('post-button')
postButton.addEventListener('click',processPostMessage)
let postMessage=document.querySelector('#post-message')
postMessage.addEventListener('input',function(event){
    // console.log(event.target.value)
})

let recentPostList=document.getElementById('recent-posts')

function updatePostsList(){
    recentPostList.textContent=''
    posts.forEach(function(post,i){
        console.log(post.text, post.postedBy)
        let postLi=document.createElement('li')
        let postText=document.createElement('p')
        let likeButton=document.createElement('button')
        likeButton.addEventListener('click',processLike)
        postLi.textContent=`${i}: ${post.text} by ${post.postedBy}`
        recentPostList.appendChild(postLi)
    })
}

function processLike(){
    //find the post data and increment its like count
}

function processPostMessage(event){
    // console.log(postMessage.value)
    event.preventDefault()
    postMyMessage(postMessage.value)
    postMessage.value=''
    
}

function postMyMessage(message){
    let newPost={
        text: message,
        postedAt: Date.now(),
        postedBy: 'user1',
        likes:0
    }
    posts.unshift(newPost)
    // console.log(posts)
    updatePostsList()
}