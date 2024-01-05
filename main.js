// ihawp 2024

// var for app
let logged = false;
let usernamee = undefined;
let userIDD = undefined;
const d = new Date();
let year = d.getFullYear();


// offset global values for loading posts
// will be updated in future (more vars)
let postsOffset = 0;
let profileOffset = 0;
let postOffset = 0;
const postsLimit = 25;

let profileCount = 0;

// create array for
let pageInfo = {
}

function app() {
    useAJAXGetData('php/checkLogged.php')
        .then(userInfo => {

            // logged logic
            if (userInfo.response === false) {
                logged = false;
            } else {
                usernamee = userInfo.namee;
                userIDD = userInfo.idd;
                logged = true;
                document.body.innerHTML += `${usernamee}, ${userIDD}`;
            }

            // pageInfo logic
            if (logged === false) {
                pageInfo = {
                    'header': {
                        'content': `
                        <header>
                            <h1>this is the header!</h1>
                            <nav>
                            <a onclick="printPage('home')">home</a>                      
                            <a onclick="printPage('login')">login</a>                      
                            <a onclick="printPage('register')">register</a>                      
                        </nav>
                        </header>  
                        `
                    },
                    'footer': {
                        'content': `
                            <footer>
                                <p>&copy; ihawp ${year};</p>
                            </footer>
                        `
                    },
                    'home': {
                        'content': `
            <section>
                <h1>this is the home page, you are not logged in!</h1>
            </section>
        `
                    },
                    'login': {
                        'content': `
            <h1>login</h1>
            <form method="POST" action="php/login.php" id="loginForm">
                <input type="text" placeholder="username" name="loginusername" id="loginusername" required>
                <input type="password" placeholder="password" name="loginpassword" id="loginpassword" required>
                <button type="submit" onclick="formSubmit(event, 'login')">login</button>
            </form>
        `
                    },
                    'register': {
                        'content': `
            <h1>register</h1>
            <form method="POST" action="php/register.php" id="registerForm">
                <input type="text" placeholder="username" name="username" id="username" required>
                <input type="password" placeholder="password" name="password" id="password" required>
                <button type="submit" onclick="formSubmit(event, 'register')">register</button>
            </form>
        `
                    },
                    '404': {
                        'content': `
                            <h1>404 we do not know what you want from us</h1>
                            <a onclick="printPage('home')">back to home!</a>
                    `
                    }
                }
            } else if (logged === true) {
                pageInfo = {
                    'header': {
                        'content': `
                            <header>
                            <h1>this is the header! logged in!</h1>
                            <nav>
                            <a onclick="printPage('leaderboard')">leaderboard</a>                      
                            <a onclick="printPage('home')">home</a>                      
                            <a onclick="printPage('settings')">settings</a>                      
                            <a onclick="openProfile(userIDD)">profile</a>                      
</nav>
</header>  
                        `
                    },
                    'footer': {
                        'content': `
                            <footer>
                                <p>&copy; ihawp ${year};</p>
                            </footer>
                        `
                    },
                    '404': {
                        'content': `
                            <h1>404 we do not know what you want from us</h1>
                                                    <a onclick="printPage('home')">back to home!</a>

`
                    },
                    'home': {
                        'content': `
                            <section>
                                <h1>you are logged in!</h1>
                                <form id="makeAPostForm" action="php/addPost.php" method="POST">
                                    <input type="text" placeholder="Say Something!" id="makeAPost" name="makeAPost">
                                    <button type="submit" onclick="formSubmit(event, 'makeAPost')">post it</button>
                                </form>
                            </section>
                            <section id="printPostsSection">
                                
                            </section>
                            <div id="loadMoreButtonDiv">
                            <button onclick="loadPostsForHome()">load more!</button>                            
</div>
        `
                    },
                    'settings': {
                        'content': `
                            <h1>you are logged in!</h1>
                            <a href="php/logout.php">logout</a>
                `
                    },
                    'comment': {
                        'content': `
                            <form id="addCommentFormm" action="php/addComment.php" method="POST">
                                <input type="text" name="commentContent" id="commentContent">
                                <div id="addCommentForm"></div>
                                <button type="submit" onclick="formSubmit(event, 'addComment')">add comment</button>
                            </form>
                        `
                    },
                    'post': {
                        'content': `
                            <section id="viewPostSection">
<h1>post</h1>
                            <section>
                            <div id="loadMoreButtonDiv">
</div>
                        `
                    },
                    'leaderboard': {
                        'content': `
                            <section id="leaderboardPostsSection">
<h1>leaderboard</h1>
                            <section>
                        `
                    },
                    'profile': {
                        'content': `
                            <h1>profile</h1>
                            <section id="profileSection"></section>
                            <div id="loadMoreButtonDiv">
</div>
                        `
                    }
                }
            }

            // page logic
            let page = getPage();
            if (page==='post'){
                openViewPost(getPostID());
            } else if (page==='profile') {
                openProfile(getProfileID());
            } else if (page.length>0) {
                printPage(page);
            } else {
                    printPage('home');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// form logic for pausing and checking info before submitting
function formSubmit(event, type) {
        const registerFormSubmission = document.getElementById('registerForm');
        const loginFormSubmission = document.getElementById('loginForm');
        const makeAPostForm = document.getElementById("makeAPostForm");
        const addComment = document.getElementById("addCommentFormm");
        event.preventDefault();

        switch (type) {
            case ('login'):
                setTimeout(function() {
                    loginFormSubmission.submit();
                }, 2000);
                break;
            case ('register'):
                setTimeout(function() {
                    registerFormSubmission.submit();
                }, 2000);
                break;
            case ('makeAPost'):
                makeAPostForm.submit();
                break;
            case ('addComment'):
                document.getElementById('addCommentForm').innerHTML += `
                    <input type='text' value='${getPostID()}' name="post_id" hidden required>
                `;
                addComment.submit();
                break;
        }
}

/// ajax stuff
function useAJAXGetData(url, data) {
    return new Promise((resolve, reject) => {
        ajaxGETData(url, data)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function ajaxGETData(url, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        if (data) {
            url += '?' + Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
        }
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        xhr.send();
    });
}

// open page that requires info, I should try just using php, no ajax next time
function openProfile(userID) {
    addToURL('user_id', userID);
    printPage('profile');
    document.getElementById('loadMoreButtonDiv').innerHTML += `
                                <button onclick="loadPostsForProfile(${userID})">load more!</button>                            

    `;
}
function openViewPost(postID) {
    addToURL('post_id', postID);
    printPage('post');
    document.getElementById('loadMoreButtonDiv').innerHTML += `
                                <button onclick="loadPostsForViewPost(${postID})">load more!</button>                            

    `;
}
function openCommentMenu(postID) {
    addToURL('post_id', postID);
    printPage('comment');
}

function printPage(page) {

    if(pageInfo.hasOwnProperty(page)) {
        changeURL(page);
        document.body.innerHTML =
            pageInfo['header']['content']+
            pageInfo[page]['content'];
        if (page === 'home') {
            loadPostsForHome();
        }
        if (page === 'leaderboard') {
            loadPostsForLeaderboard();
        }
        if (page === 'post') {
            loadPostsForViewPost(getPostID());
        }
        if (page === 'profile') {
            loadPostsForProfile(getProfileID());
        }
    } else {
        printPage('404');
    }
}

// URL stuff
function changeURL(page) {
    if (page !== 'home') {
        postsOffset = 0;
    }
    if (page === 'post') {
        postOffset = 0;
    }
    if (page === 'profile') {
        profileOffset = 0;
        profileCount = 0;
    }

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', page);
    const newURL = `${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState({}, '', newURL);
}
function getPage() {
    let w = new URLSearchParams(window.location.search).get('page');
    if (w === null) {
        return 'home';
    } else {
        return w;
    }
}
function addToURL(param, value) {
    let currentURL = new URL(window.location.href);
    let searchParams = currentURL.searchParams;
    searchParams.set(param, value);

    // update history to stop reload
    window.history.replaceState({}, '', currentURL.toString());
}


function addALike(postID) {
    let wow = {
        'post_id': postID
    }
    useAJAXGetData('php/addLike.php', wow)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function deletePost(postID, userID) {
    let wow = {
        'post_id': postID,
        'user_id': userID
    }
    useAJAXGetData('php/removePost.php', wow)
        .then(response => {
            if (response['post_deleted']) {
                document.getElementById(`post_id_${postID}`).remove();
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });

    // remove post from DOM
}

function loadPostsForProfile(profileID) {
    let wow = {
        'profile_id': profileID,
        'offset': profileOffset
    }
    ajaxGETData('php/loadProfile.php', wow)
        .then(response=>{
            printProfileContent(response['user_info'], 'profileSection');
            printPostContent(response['posts'], 'profileSection');
        })
        .catch(error=>{
            console.log(error);
        });
}
function loadPostsForViewPost(postID) {
    let wow = {
        'offset': postOffset,
        'post_id': postID
    }
    ajaxGETData('php/loadPostandComments.php', wow)
        .then(response=>{
            printPostContent(response, 'viewPostSection');
        })
        .catch(error=>{
            console.log(error);
        });
}
function loadPostsForHome() {
    let wow = {
        'offset': postsOffset,
        'limit': postsLimit
    }
    useAJAXGetData('php/loadPosts.php', wow)
        .then(posts => {
            printPostContent(posts, 'printPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function loadPostsForLeaderboard() {
    useAJAXGetData('php/loadPostsForLeaderboard.php')
        .then(posts => {
            printPostContent(posts, 'leaderboardPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function printProfileContent(user_info, idOfPrint) {
    if (profileCount === 0) {
        document.getElementById(idOfPrint).innerHTML += `
        ${user_info['id']}, ${user_info['username']}
    `;
        profileCount += 1;
    }
}
function printPostContent(posts, idOfPrint) {
    if (posts.length === 0) {
        if (getPage() === 'post') {
            document.getElementById('loadMoreButtonDiv').innerHTML = `
                  <p>There are no more comments!</p>
            `;
        } else {
            document.getElementById('loadMoreButtonDiv').innerHTML = `
                  <p>There are no more posts!</p>
            `;
        }
    }


    for (let i = 0; i<posts.length; i++) {
        let p = posts[i];
        document.getElementById(idOfPrint).innerHTML += `
            <div id="post_id_${p['post_id']}">
                    ${p['post_id']} ${p['user_id']} <a onclick="openProfile(${p['user_id']})">${p['username']}</a> ${p['content']}
                    <br>
                    <button onclick="addALike(${p['post_id']})">like me</button>
                    
                    <button onclick="openCommentMenu(${p['post_id']})">comment on me</button>
                
                <button onclick="openViewPost(${p['post_id']})">view me!</button>
                   
            </div>                        
            `;
        if (p['user_id'] === userIDD) {
            document.getElementById('post_id_'+p['post_id']).innerHTML += `
                <button onclick="deletePost(${p['post_id']}, ${p['user_id']})">delete me!</button>
                <br>
            `
        }
    }

    // add if userID for post !== getUSERID() function (to be made)
    // then dont print deletePost button

    // add if get page === post dont print the open view post

    // add to posts offset (this value would need to be changed at some point maybe probably!!:))

    if (getPage() === 'home') {
        postsOffset+=25;
    }
    if (getPage() === 'post') {
        postOffset += 25;
    }
    if (getPage() === 'profile') {
        profileOffset += 25;
    }
}

// get post id anytime it is in url
function getPostID() {
    return new URLSearchParams(window.location.search).get('post_id');
}
function getProfileID() {
    let w = new URLSearchParams(window.location.search).get('user_id');
    if (w === null) {
        return 0;
    } else {
        return w;
    }
}
// start app
app();
