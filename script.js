const initialLikes = 2400
const initialDislikes = 120

let likesCount = initialLikes
let dislikesCount = initialDislikes

let like_button = document.getElementById("like_button")
let dislike_button = document.getElementById("dislike_button")

const comment_box = document.getElementById("comment_box")
const submit_btn = document.getElementById("submit")
const clear_btn = document.getElementById("clear")
const comments_list = document.getElementById("comments")

like_button.innerText = "👍 " + likesCount
dislike_button.innerText = "👎 " + dislikesCount

// cookie expiration duration
const duration = 2 * 60 * 1000

like_button.addEventListener("click", () => {
    likesCount++
    like_button.innerText = "👍 " + likesCount
    setCookie(true)
}, {once:true})

dislike_button.addEventListener("click", () => {
    dislikesCount++
    dislike_button.innerText = "👎 " + dislikesCount
    setCookie(false)
}, {once:true})

clear_btn.addEventListener("click", clearEverything)

submit_btn.addEventListener("click", () => {
    // text from comment box
    let comment = comment_box.value
    // cannot type comment unless voted
    if(document.cookie.includes("voted")) {
        addComment(comment)
    }   
})

function clearEverything() {
    unsetCookie()
    const comment = document.querySelector(".comment")
    if(comment) {
        comment.remove()
    }
    comment_box.value = ""
}

function setCookie(liked) {
    if(liked) {
        dislike_button.disabled = true
    }
    else {
        like_button.disabled = true
    }
    const expireOn = new Date(Date.now() + duration)
    const cookieExpiration = "path=/; expires=" + expireOn + ";"
    document.cookie = "voted=true;" + cookieExpiration
    document.cookie = "liked=" + liked + ";" + cookieExpiration
}

function unsetCookie() {
    document.cookie = "voted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "liked=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "comment=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

function getCookie(name) { // Not my code. Function to get cookie value from key
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

function addComment(comment) {

    // check if article already exists
    let check_article = comments_list.querySelector("article")

    // only one comment allowed
    if (!check_article) {
        const article = createComment(comment)
        // add comment to list
        comments_list.appendChild(article)
        // set expiration the moment user comments
        const expireOn = new Date(Date.now() + duration)
        const cookieExpiration = "path=/; expires=" + expireOn + ";"
        // add comment to cookie
        document.cookie = "comment=" + comment + ";" + cookieExpiration
    }   
}

function createComment(comment) {
    let article = document.createElement("article")
    article.className = "comment"

    let img = document.createElement("img")
    img.src = "https://avatars.discourse-cdn.com/v4/letter/a/dfb087/48.png"
    article.appendChild(img)

    let div = document.createElement("div")
    let span = document.createElement("span")
    span.innerText = comment
    div.appendChild(span)
    article.appendChild(div)
    
    return article
}

document.addEventListener("DOMContentLoaded", (event) => {
    if (document.cookie.indexOf("voted") > -1) {
        like_button.disabled = true
        dislike_button.disabled = true
        submit_btn.disabled = true
        if(getCookie("liked") === "true") {
            like_button.innerText = "👍 " + ++likesCount
        }
        else {
            dislike_button.innerText = "👎 " + ++dislikesCount
        }
        if(document.cookie.includes("comment")) {
            let comment = getCookie("comment")
            addComment(comment)
        }
    }
}) 
