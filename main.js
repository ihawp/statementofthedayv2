// ihawp 2024

// var for app
let logged = false;
let usernamee = undefined;
let userIDD = undefined;
let pfpp = undefined;
const d = new Date();
let year = d.getFullYear();


// offset global values for loading posts
// will be updated in future (more vars)
let postsOffset = 0;
let profileOffset = 0;
let postOffset = 0;
const postsLimit = 25;

let userFilters = new Array();
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
                usernamee = userInfo['namee'];
                userIDD = userInfo['idd'];
                pfpp = userInfo['pfpp'];
                logged = true;
                document.body.innerHTML += `${usernamee}, ${userIDD}`;
            }

            // pageInfo logic
            if (logged === false) {
                pageInfo = {
                    'header': {
                        'content': `
                        <header>
                            <nav>
                            <a onclick="printPage('home')">home</a>                      
                            <a onclick="printPage('login')">login</a>                      
                            <a onclick="printPage('register')">register</a>                      
                        </nav>
                        </header>  
                        <div id="fixedHeader"></div>
                        `
                    },
                    'footer': {
                        'content': `
                            <footer class="flex-row">
                                <p>&copy; ihawp ${year}</p>
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
                loadFiltersForSettings();
                pageInfo = {
                    // make function for nav clicking
                    // so that the nav can be coloured when you
                    // are on a certain page


                    'header': {
                        'content': `
                            <header>
                            <nav>
                            <a id="leaderboardButton" onclick="printPage('leaderboard')"><i class="fa-solid fa-trophy"></i></a>                      
                            <a id="homeButton" onclick="printPage('home')"><i class="fa-solid fa-house"></i></a>                      
                            <a id="profileButton" onclick="openProfile(userIDD)"><i class="fa-solid fa-user"></i></a>                      
                            <a id="settingsButton" onclick="printPage('settings')"><i class="fa-solid fa-gear"></i></a>                      
</nav>
</header>  
<div id="fixedHeader"></div>
                        `
                    },
                    'footer': {
                        'content': `
                            <footer class="flex-row">
                                <p>&copy; ihawp ${year}</p>
                            </footer>
                        `
                    },
                    '404': {
                        'content': `
<section>
                            <h1>404 we do not know what you want from us</h1>
                                                    <a onclick="printPage('home')">back to home!</a>
</section>

`
                    },
                    'home': {
                        'content': `
                            <section>
                                <form id="makeAPostForm" action="php/addPost.php" method="POST">
                                    <textarea maxlength="255" placeholder="Say Something!" id="makeAPost" name="makeAPost"></textarea>
                                    <br>
                                    <a id="postButton" type="submit" onclick="formSubmit(event, 'makeAPost')"><i class="fa-solid fa-paper-plane"></i></a>
                                </form>
                      <div id="a-group-inner">
                                    <a id="viewHome" onclick="printPage('home')"><i class="fa-solid fa-earth-americas"></i></a>
                                    <a onclick="printPage('viewFollowingPosts')"><i class="fa-solid fa-person-circle-plus"></i></a>
                                    <a onclick="printPage('viewFilteredPosts')"><i class="fa-solid fa-list-check"></i></a>
</div>
                                   
                            </section>
            
                            <section id="printPostsSection">
                                
                            </section>
                            <div id="loadMoreButtonDiv">
                            <a onclick="loadPostsForHome()"><i class="fa-solid fa-circle-chevron-down"></i></a>                            
</div>
        `
                    },
                    'settings': {
                        'content': `
<section>
 <h1>you are logged in!</h1>
                            <a href="php/logout.php">logout</a>

<h1>add pfp</h1>
<form id="addPFPForm" action="php/changePFP.php" method="POST">
    <img src="${pfpp}" width="50px" height="50px">
    <input type="file" name="file" id="file" accept=".png .jpg .jpeg">
    <button type="submit" onclick="formSubmit(event, 'changePFP')">change pfp</button>
</form>
<h1>username</h1>
<form id="usernameForm">
    <input placeholder="${usernamee}" disabled>
</form>
<h1>change password</h1>
<form id="passwordForm">
    <input placeholder="*******">
</form>
<h1>add filters</h1>
<div id="filtersFormCollectedErrorBox">

</div>
<form id="filtersForm">
    <input type="text" id="addFilterValue">
    <button type="submit" onclick="addFilters(event)">add filter</button>
</form>
<div id="filtersFormCollected">

</div>
</section>
                          
                `
                    },
                    'post': {
                        'content': `
                            <section id="viewPostSection">
                            </section>
                            <div id="loadMoreButtonDiv">
</div>
                        `
                    },
                    'leaderboard': {
                        'content': `
                           
                            <section id="leaderboardPostsSection">
                            <h1>Leaderboard</h1>
                            </section>
                            <div id="loadMoreButtonDiv">
                            <p>Want to make it on the leaderboard?</p>
                            <p id="leaderboardHomeLink">Make a post<a onclick="printPage('home')">here.</a></p>
</div>
                        `
                    },
                    'profile': {
                        'content': `
                            <section id="profileSection"></section>
                            <div id="loadMoreButtonDiv">
</div>
                        `
                    },
                    'viewFollowingPosts': {
                        'content': `
                            <section>
                                <form id="makeAPostForm" action="php/addPost.php" method="POST">
                                    <textarea maxlength="255" placeholder="Say Something!" id="makeAPost" name="makeAPost"></textarea>
                                    <br>
                                    <a id="postButton" type="submit" onclick="formSubmit(event, 'makeAPost')"><i class="fa-solid fa-paper-plane"></i></a>
                                </form>
                            </section>
                            <section id="a-group">
                                <div id="a-group-inner">
                                    <a onclick="printPage('home')"><i class="fa-solid fa-earth-americas"></i></a>
                                    <a id="viewFollowing" onclick="printPage('viewFollowingPosts')"><i class="fa-solid fa-person-circle-plus"></i></a>
                                    <a onclick="printPage('viewFilteredPosts')"><i class="fa-solid fa-list-check"></i></a>
</div>
                                   
                            </section>
                            <section id="printPostsSection">
                                
                            </section>
                            <div id="loadMoreButtonDiv">
                            <a onclick="loadPostsForFollowing()"><i class="fa-solid fa-circle-chevron-down"></i></a>                            
</div>
                        `
                    },
                    'comment': {
                        'wow':123
                    },
                    'viewFilteredPosts': {
                        'content': `
                            <section>
                                <form id="makeAPostForm" action="php/addPost.php" method="POST">
                                    <textarea maxlength="255" placeholder="Say Something!" id="makeAPost" name="makeAPost"></textarea>
                                    <br>
                                    <a id="postButton" type="submit" onclick="formSubmit(event, 'makeAPost')"><i class="fa-solid fa-paper-plane"></i></a>
                                </form>
                            </section>
                            <section id="a-group">
                                <div id="a-group-inner">
                                    <a onclick="printPage('home')"><i class="fa-solid fa-earth-americas"></i></a>
                                    <a onclick="printPage('viewFollowingPosts')"><i class="fa-solid fa-person-circle-plus"></i></a>
                                    <a id="viewFiltered" onclick="printPage('viewFilteredPosts')"><i class="fa-solid fa-list-check"></i></a>
</div>
                                   
                            </section>
                            <section id="printPostsSection">
                                
                            </section>
                            <div id="loadMoreButtonDiv">
                            <a onclick="loadPostsForFiltering()"><i class="fa-solid fa-circle-chevron-down"></i></a>                            
</div>
                        `
                    }
                }
            }

            // page logic
            let page = getParam('page');


            if (pageInfo.hasOwnProperty(page)) {
                if (page==='post'){
                    openViewPost(getParam('post_id'));
                } else if (page==='profile') {
                    openProfile(getParam('user_id'));
                } else {
                    printPage(page);
                }
            } else {
                printPage('404');
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
        const addComment = document.getElementById("addCommentForm");
        const addPFP = document.getElementById("addPFPForm");

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
                addComment.submit();
                closeCommentMenu();
                break;
            case ('changePFP'):
                console.log('wow');
                addPFP.submit();
                break;
        }
}


function deleteFilter(filter) {
    let wow = {
        'filter': filter
    }
    ajaxGETData('php/removeFilter.php', wow)
        .then(response=> {
            if (response['wow']) {
                document.getElementById(filter).remove();
                let indexToRemove = userFilters.indexOf(filter);

                if (indexToRemove !== -1) {
                    userFilters = userFilters.slice(0, filter).concat(userFilters.slice(indexToRemove + 1));
                }

                document.getElementById('filtersFormCollectedErrorBox').innerHTML = `
                    <p>filter deleted successfully!</p>
                `;
            }
        })
        .catch(error=>{
           console.log(error);
        });
}
// dom exclusive
function loadFiltersForSettings() {
    ajaxGETData('php/loadFilters.php')
        .then(response=> {
            userFilters = response;
            if (document.getElementById('filtersFormCollected')) {
                printFiltersForSettings();
            }
        })
        .catch(error=> {
            console.log(error);
        })
}
function printFiltersForSettings() {
    for (let i = 0; i<userFilters.length;i++) {
        document.getElementById('filtersFormCollected').innerHTML += `
                <div class="filter" id="${userFilters[i]}">
                    <p>${userFilters[i]}</p>
                    <button onclick="deleteFilter('${userFilters[i]}')">delete filter '${userFilters[i]}'</button>
                </div>
            `;
    }
}
function addFilters(event) {
    event.preventDefault();
    let q = document.getElementById('addFilterValue').value;
    if (!userFilters.includes(q)) {
        let wow = {
            'filter': q
        }
        // add ajax here, can still have same responses
        ajaxGETData('php/changeFilters.php', wow)
            .then(response => {
                if (response['thisis']) {
                    userFilters.push(q);
                    document.getElementById('filtersFormCollected').innerHTML += `
                <div class="filter" id="${q}">
                    <p>${q}</p>
                    <button onclick="deleteFilter('${q}')">delete filter ${q}</button>
                </div>
            `;
                    document.getElementById('filtersFormCollectedErrorBox').innerHTML = `
            <p>filter successfully added</p>
        `;
                } else {
                    document.getElementById('filtersFormCollectedErrorBox').innerHTML = `
            <p>filter NOT added</p>
        `;
                }
            })
            .catch(error => {
                console.log(error);
            })
    } else {
        document.getElementById('filtersFormCollectedErrorBox').innerHTML = `
            <p>filter already added</p>
        `;
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

// open page that requires info
function openProfile(userID) {
    addToURL('user_id', userID);
    printPage('profile');
    document.getElementById('loadMoreButtonDiv').innerHTML += `
                                <a onclick="loadPostsForProfile(${userID})"><i class="fa-solid fa-circle-chevron-down"></i></a>                            

    `;
}
function openViewPost(postID) {
    addToURL('post_id', postID);
    printPage('post');
    document.getElementById('loadMoreButtonDiv').innerHTML = `
                                <a onclick="loadPostsForViewPost(${postID})"><i class="fa-solid fa-circle-chevron-down"></i></a>                            

    `;
}
function openDeleteMenu(postID, userID) {
    // just like comment menu
    // have a popup confirming whether they
    // would like to delete their post or not!
    addToURL('deleting', true);


    // display post being commented on here aswell
    // make close button an X and red

    document.body.innerHTML +=
        `<section id="deleteSection">
<div class="">
                               <p>Are you sure you want to delete your post?</p> 
                               <button onclick="closeDeleteMenu()">close</button>
                               <button onclick="deletePost(${postID}, ${userID})">Yes Delete my post</button>

</div>
</section>`;
    document.getElementById('deleteSection').addEventListener('click', function(event) {
        if (event.target === this) {
            closeDeleteMenu();
        }
    });
}
function openCommentMenu(postID) {
    addToURL('post_id', postID);
    addToURL('commenting', true);
    document.body.innerHTML +=
        `<section id="commentSection">
                                <form id="addCommentForm" action="php/addComment.php" method="POST">
                                    <textarea maxlength="255" placeholder="Say Something!" name="commentContent" id="commentContent"></textarea>
                                    <br>
                                                        <input type='text' value='${getParam('post_id')}' name="post_id" hidden required>            

                                    <a id="postButton" type="submit" onclick="formSubmit(event, 'addComment')"><i class="fa-solid fa-paper-plane"></i></a>
                                </form>
                                <button onclick="closeCommentMenu()">close</button>
</section>`;
    document.getElementById('commentSection').addEventListener('click', function(event) {
        if (event.target === this) {
            closeCommentMenu();
        }
    });
}

// close overlay
function closeDeleteMenu() {
    document.getElementById('deleteSection').remove();
    removeFromURL('deleting');
}
function closeCommentMenu() {
    document.getElementById('commentSection').remove();
    removeFromURL('commenting');
}

// URL stuff
function changeURL(page) {
    postsOffset = 0;
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
function addToURL(param, value) {
    let currentURL = new URL(window.location.href);
    let searchParams = currentURL.searchParams;
    searchParams.set(param, value);

    // update history to stop reload
    window.history.replaceState({}, '', currentURL.toString());
}
function removeFromURL(param) {
    let currentURL = new URL(window.location.href);
    let searchParams = currentURL.searchParams;
    searchParams.delete(param);

    window.history.replaceState({}, '', currentURL.toString());
}
function getParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// interact with post/account
function addFollow(followingID, followedID) {
    let wow = {
        'followed': followedID,
        'following': followingID
    }
    ajaxGETData('php/addFollow.php', wow)
        .then (response=> {
            if (response['unfollowed']) {
                document.getElementById('followButton').innerText = `follow`;
                let w = document.getElementById('followCount');
                let q = parseInt(w.innerText);
                w.innerText = q-1;
            }
            if (response['following']) {
                document.getElementById('followButton').innerText = `unfollow`;
                let w = document.getElementById('followCount');
                let q = parseInt(w.innerText);
                w.innerText = q+1;
            }
        })
        .catch (error=> {
            console.log(error);
        });
}
function addALike(postID) {
    let wow = {
        'post_id': postID
    }
    useAJAXGetData('php/addLike.php', wow)
        .then(response => {
            if (response['removed_like']) {
                document.getElementById(`${postID}_likes_count`).innerText = parseInt(document.getElementById(`${postID}_likes_count`).innerText) - 1;
            }
            if (response['like_added']) {
                document.getElementById(`${postID}_likes_count`).innerText = parseInt(document.getElementById(`${postID}_likes_count`).innerText) + 1;
            }
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
    closeDeleteMenu();
}

// load posts
function loadPostsForFiltering() {
    let wow = {
        'offset': postsOffset,
        'limit': postsLimit
    }
    useAJAXGetData('php/loadPostsFiltered.php', wow)
        .then(posts => {
            console.log(posts);
            printPostContent(posts, 'printPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function loadPostsForFollowing() {
    let wow = {
        'offset': postsOffset,
        'limit': postsLimit
    }
    useAJAXGetData('php/loadPostsFollowing.php', wow)
        .then(posts => {
            printPostContent(posts, 'printPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
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


// print content
function printPage(page) {
        changeURL(page);
        document.body.innerHTML =
            pageInfo['header']['content']+
            pageInfo[page]['content']+
            pageInfo['footer']['content']

        if (page === 'home' || page ==='viewFollowingPosts' || page === 'viewFilteredPosts') {
            let w = document.getElementById('homeButton');
            w.style.backgroundColor = 'black';
            w.style.color = 'white'
        }
        if (page === 'home') {
            loadPostsForHome();
            let w= document.getElementById('viewHome').style;
            w.color = 'white';
            w.backgroundColor = 'black';
        }
        if (page === 'viewFollowingPosts') {
            loadPostsForFollowing();
            let w= document.getElementById('viewFollowing').style;
            w.color = 'white';
            w.backgroundColor = 'black';
        }
        if (page === 'viewFilteredPosts') {
            loadPostsForFiltering();
            let w= document.getElementById('viewFiltered').style;
            w.color = 'white';
            w.backgroundColor = 'black';
        }
        if (page === 'leaderboard') {
            loadPostsForLeaderboard();

            let w = document.getElementById('leaderboardButton');
            w.style.backgroundColor = 'black';
            w.style.color = 'white'
        }
        if (page === 'post') {
            loadPostsForViewPost(getParam('post_id'));
        }
        if (page === 'settings') {
            printFiltersForSettings(userFilters);
            let w = document.getElementById('settingsButton');
            w.style.backgroundColor = 'black';
            w.style.color = 'white'
        }
        if (page === 'profile') {
            loadPostsForProfile(getParam('user_id'));

            let w = document.getElementById('profileButton');
            w.style.backgroundColor = 'black';
            w.style.color = 'white'
        }

        if (getParam('commenting')) {
            openCommentMenu(getParam('post_id'));
        }
        if (getParam('deleting')) {
            openDeleteMenu(getParam('post_id'), getParam('user_id'));
        }
}
function printProfileContent(user_info, idOfPrint) {
    if (profileCount === 0) {
        document.getElementById(idOfPrint).innerHTML += `
        <section id="profileHeader">
            <img alt="${user_info['username']}-pfp" src="${user_info['pfp']}">
            <h1>@${user_info['username']}</h1>
            <br>
            <br>
            <div class="flex-row">
                <a class="flex-row">
                    <p id="followingLabel">Following: </p>
                    <p id="followingCount">${user_info['following_count']}</p>
                </a>
                <a class="flex-row">
                    <p id="followersLabel">Followers:</p>
                    <p id="followCount">${user_info['follow_count']}</p>
                </a>
            </div>
</div>
            <div id="followButtonDiv"></div>
        </section>
    `;

        if (user_info['id'] !== userIDD) {

            document.getElementById('followButtonDiv').innerHTML = `
                <button id="followButton" onclick="addFollow(userIDD, ${user_info['id']})"></button>
            `;

            let wow = {
                'followed_id': user_info['id'],
                'follower_id': userIDD
            }
            ajaxGETData('php/checkFollow.php', wow)
                .then(response=>{
                    if (response.following) {
                        document.getElementById('followButton').innerText = `unfollow`;
                    } else {
                        document.getElementById('followButton').innerText = `follow`;
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
        }
        profileCount += 1;
    }
}
function printPostContent(posts, idOfPrint) {
    if (posts.length === 0 && getParam('page') !== 'leaderboard') {
        if (getParam('page') === 'post') {
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
            <div class="post" id="post_id_${p['post_id']}">
                            <div class="flex-row align-bottom">
                <img class="postImg" alt="${p['username']}-pfp" src="${p['pfp']}" draggable="false" onclick="openProfile(${p['user_id']})">
                <a class="profileLink" onclick="openProfile(${p['user_id']})">@${p['username']}</a> 
</div>
                <h2>${p['content']}</h2>
                <div class="flex-row post-buttons"  id="post_id_add_delete_${p['post_id']}">
                <a onclick="addALike(${p['post_id']})"><i class="fa-solid fa-heart"></i></a>
                <p id="${p['post_id']}_likes_count">${p['likes']}</p>         
                <a onclick="openCommentMenu(${p['post_id']}, ${p['super_parent_post_id']})"><i class="fa-solid fa-comment"></i></a>
                <p>${p['comments']}</p>         
                <a onclick="openViewPost(${p['post_id']})"><i class="fa-solid fa-eye"></i></a>
            <div class="postOverlay">
            </div>
</div>         
  
            `;
        if (p['user_id'] === userIDD) {
            document.getElementById('post_id_add_delete_'+p['post_id']).innerHTML += `
                <a onclick="openDeleteMenu(${p['post_id']}, ${p['user_id']})"><i class="fa-solid fa-trash"></i></a>
                <br>
            `
        }

        if (getParam('page') === 'leaderboard') {
            document.getElementById('post_id_'+p['post_id']).innerHTML += `
                <div class="leadboardNumber">
                    <h1>
                         ${i+1}           
                    </h1>
                </div>
            `;
        }
    }


    let w = getParam('page');

    if (w=== 'home' || w==='viewFollowingPosts' || w==='viewFilteredPosts') {
        postsOffset+=25;
    }
    if (w=== 'post') {
        postOffset += 25;
    }
    if (w=== 'profile') {
        profileOffset += 25;
    }
}


// start app
app();
