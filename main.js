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
let viewPostOffset = 0;
const postsLimit = 25;
let followersOffset = 0;
let followingOffset = 0;


let userFilters = new Array();
let medals = new Array();
let selectedMedal = undefined;
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
                pfpp = 'userPFP/'+userInfo['pfpp'];
                selectedMedal = JSON.parse(userInfo['medal']);
                logged = true;
            }

            // pageInfo logic
            if (logged === false) {
                pageInfo = {
                    'header': {
                        'content': `
                   <div id="alert-container">
                        
                        </div>
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
                <input type="password" placeholder="password" name="password" id="password" maxlength="25" required>
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
                    'header': {
                        'content': `
                   <div id="alert-container">
                        
                        </div>
                            <header>
                            <nav>
                            <a id="leaderboardButton" onclick="printPage('leaderboard')"><i class="fa-solid fa-trophy"></i></a>                      
                            <a id="homeButton" onclick="printPage('home')"><i class="fa-solid fa-house"></i></a>                      
                            <a id="profileButton" onclick="openProfile(userIDD, event)"><i class="fa-solid fa-user"></i></a>                      
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
                            <section id="printPostsSectionn">
                            
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
<div id="settingsSection">
<div class="nice-box">

        <form id="addPFPForm" class="flex-row align-end" method="POST" action="php/changePFP.php" enctype="multipart/form-data">
            <div class="pfpImageOverlay">
                <img id="previewImage" class="settingsPFP" loading="lazy" src="${pfpp}" width="125px" height="125px">
                <div class="addPFPOverlay">
                    <h1>add pfp</h1>
                    <input type="file" name="file" id="file" accept=".png, .jpg, .jpeg" onchange="previewFile()">
                </div>
            </div>
            <button type="submit" onclick="formSubmit(event, 'changePFP')">Submit</button>
        </form>

<form id="usernameForm">
    <label for="usernameeee">Username:</label>
    <input id="usernameeee" value="${usernamee}" disabled>
</form>
<form id="passwordForm">
    <label for="newPassword">Change Password:</label>
    <input id="newPassword" placeholder="New Password" maxlength="25">
    <button type="submit">Submit</button>
</form>
<a id="logout" href="php/logout.php"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
</div>

<div id="medalsContainer" class="nice-box">
    <form id="medalsForm">
        <div id="width-40">
</div>
        <div id="width-60">
            <div id="addToMedalsForm">
            
            </div>
        </div>
       </form>
</div>
<div id="addFilters" class="nice-box">
    <h1>Filters</h1>

    <form id="filtersForm">
        <input type="text" placeholder="Type Filter Here" id="addFilterValue">
        <button type="submit" onclick="addFilters(event)"><i class="fa-solid fa-plus"></i>Add</button>
    </form>
    <div id="filtersFormCollected">
    
    </div>
</div>
</div>
</section>
                          
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
                    'leaderboardDay': {
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
                    'leaderboardMonth': {
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
                    'leaderboardYear': {
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
                            <section id="printPostsSectionn">
                            
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
                            <section id="printPostsSectionn">
                            
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
                if (page==='profile') {
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
function previewFile() {
    var preview = document.getElementById('previewImage');
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}
// form logic for pausing and checking info before submitting
function selectOption(option) {
    // Deselect all options
    var options = document.querySelectorAll('.option');
    options.forEach(function (opt) {
        opt.classList.remove('selected');
    });

    option.classList.add('selected');
    let lul = parseInt(option.dataset.placement);
    let lul3 = parseInt(option.dataset.postid);
    let lul2 = document.getElementById('currentMedal');
    if (lul === 1) {
        lul2.style.backgroundColor = 'gold';
        lul2.style.color = 'var(--one)';
        lul2.onclick = function() {
            openViewPost(lul3);
        };
    }
    if (lul === 2) {
        lul2.style.backgroundColor = 'silver';
        lul2.style.color = 'var(--one)';
        lul2.onclick = function() {
            openViewPost(lul3);
        };
    }
    if (lul === 3) {
        lul2.style.backgroundColor = 'brown';
        lul2.onclick = function() {
            openViewPost(lul3);
        };
    }
}
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
                registerFormSubmission.submit();
                break;
            case ('makeAPost'):
                document.getElementById('makeAPostButton').disabled = true;

                setTimeout(function() {
                    document.getElementById('makeAPostButton').disabled = false;

                    }, 5000);

                let w = new FormData(makeAPostForm);
                let wow = {
                    'content': w.get('makeAPost')
                }
                ajaxGETData('php/addPost.php', wow)
                    .then(response=> {
                        let p = response;
                        if (response['stmt'] === false) {
                            createAlert('Post NOT Added.', 'yellow');

                        } else {
                            createAlert('Post Added Successfully!', 'green')
                            if (document.getElementById('printPostsSection')) {

                                document.getElementById('printPostsSection').insertAdjacentHTML('afterbegin', `
                                    
            <div class="post newPost" id="post_id_${p['post_id']}" onclick="openViewPostInteract(${p['post_id']})">
                            <div class="paddingg">
                                                        <div class="flex-row align-bottom">
                <img class="postImg" alt="${p['username']}-pfp" loading="lazy" src="userPFP/${p['pfp']}" draggable="false" onclick="openProfile(${p['user_id']}, event)">
                <a class="profileLink" onclick="openProfile(${p['user_id']}, event)">@${p['username']}</a> 
</div>
                <h2>${p['content']}</h2>
                </div>

                <div class="flex-row post-buttons" id="post_id_add_delete_${p['post_id']}">
                <a onclick="addALike(event, ${p['post_id']})"><i class="fa-solid fa-heart"></i></a>
                <p id="${p['post_id']}_likes_count">${p['likes']}</p>         
                <a><i class="fa-solid fa-comment"></i></a>
                <p id="${p['post_id']}_comment_count">${p['comments']}</p>         
                <a onclick="openDeleteMenu(event, ${p['post_id']}, ${p['user_id']})"><i class="fa-solid fa-trash"></i></a>

</div>         
  
            
                                `);

                                setTimeout(function() {
                                    document.getElementById(`post_id_${p['post_id']}`).classList.remove('newPost');
                                }, 1000);
                            }
                        }

                        // add to dom
                    })
                    .catch(error=>{
                        createAlert('Post NOT Added.', 'red');
                    });

                break;
            case ('addComment'):

                // will need to add some divs
                // for the same effect upon
                // adding a comment
                // works in home page though!

                addComment.submit();
                break;
            case ('changePFP'):
                addPFP.submit();
                break;
            case ('changeMedal'):
                let selectedOption = document.querySelector('.option.selected');
                if (selectedOption) {
                    let wow = {
                        'medal_id': selectedOption.dataset.content
                    }
                    useAJAXPostData('php/changeMedal.php', wow)
                        .then(response=> {
                            if (response['stmt'] === true) {
                                createAlert('Medal Updated', 'green');
                            } else {
                                createAlert('Medal NOT Updated', 'red');
                            }
                        })
                        .catch(error=>{
                            console.log(error);
                        })

                    // upload to changeMedal.php
                    // using ajax request, if it goes
                    // through make on screen alert,

                    // and make db originally load the
                    // currently selected medal
                    // as .selected

                } else {
                    createAlert('Please select an option before submitting.', 'red');
                }
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

                createAlert('Filter Deleted', 'red');
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
function loadMedalsForSettings() {
    ajaxGETData('php/loadMedals.php')
        .then(response=> {
            medals = response;
            if (document.getElementById('addToMedalsForm')) {
                printMedals(response);
            }
        })
        .catch(error=> {
            console.log(error);
        })
}
function printMedals(medalss) {
    let k = medalss.length;
    if (k === 0) {
        document.getElementById(`medalsContainer`).remove();
    } else {
        if (selectedMedal !== null) {
            document.getElementById('width-40').innerHTML = `
            <a id="currentMedal" onclick="openViewPost(${selectedMedal[1]})"><i class="fa-solid fa-award"></i></a>
                        <button type="submit" onclick="formSubmit(event, 'changeMedal')">Submit</button>
        
        `;

        let q = document.getElementById('currentMedal');
        if (selectedMedal[3] === 1) {
            q.style.backgroundColor = 'gold';
            q.style.color = 'var(--one)';
        }
        if (selectedMedal[3] === 2) {
            q.style.backgroundColor = 'silver';
            q.style.color = 'var(--one)';
        }
        if (selectedMedal[3] === 3) {
            q.style.backgroundColor = 'brown';
            q.style.color = 'var(--one)';
        }
        } else {
            document.getElementById('width-40').innerHTML = `
            <a id="currentMedal" onclick="openViewPost()"><i class="fa-solid fa-award"></i></a>
                        <button type="submit" onclick="formSubmit(event, 'changeMedal')">Submit</button>
        
        `;
        }

        for (let i = 0; i<medalss.length;) {
            const timestamp = medalss[i].timestamp;
            const date = new Date(timestamp);
            const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
            const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
            const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date);
                if (selectedMedal !== null) {
                    if (medalss[i]['id'] === selectedMedal[0]) {
                        document.getElementById('addToMedalsForm').innerHTML += `
            <div id="option-${i}" class="option selected" data-content="${medalss[i].id}" data-postID="${medalss[i]['post_id']}" data-placement="${medalss[i]['placement']}" onclick="selectOption(this)">
                                        <a class="addMedal" id="addMedal-${i}"><i class="fa-solid fa-award"></i></a>
                    <div class="option-inner">
                        <p>${month} ${day}, ${year}</p>
                        <button onclick="openViewPostEvent(event, ${medalss[i].post_id})"><i class="fa-solid fa-magnifying-glass"></i>View</button>
                    </div>
                    </div>`;
                    } else {

                        document.getElementById('addToMedalsForm').innerHTML += `
            <div id="option-${i}" class="option" data-content="${medalss[i].id}" data-postID="${medalss[i]['post_id']}" data-placement="${medalss[i]['placement']}" onclick="selectOption(this)">
                    <a class="addMedal" id="addMedal-${i}"><i class="fa-solid fa-award"></i></a>
                    <div class="option-inner">
                        <p>${month} ${day}, ${year}</p>
                        <button onclick="openViewPostEvent(event, ${medalss[i].post_id})"><i class="fa-solid fa-magnifying-glass"></i>View</button>
                    </div>
            </div>
        `;

                    }
                }


            const w = document.getElementById(`addMedal-${i}`);
            if (medalss[i]['placement'] === 1) {

                w.style.width = '50px';
                w.style.height = '50px';
                w.style.fontSize = '2em';
                w.style.backgroundColor = 'gold';
                w.style.color = 'var(--one)';

            }
            if (medalss[i]['placement'] === 2) {

                w.style.width = '50px';
                w.style.height = '50px';
                w.style.fontSize = '2em';
                w.style.backgroundColor = 'silver';
                w.style.color = 'var(--one)';

            }
            if (medalss[i]['placement'] === 3) {

                w.style.width = '50px';
                w.style.height = '50px';
                w.style.fontSize = '2em';
                w.style.backgroundColor = 'brown';
                w.style.color = 'var(--one)';

            }
            i++;
        }
    }
}
async function addFilters(event) {
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
                 createAlert('Filter Added', 'green');
                } else {
                    createAlert('Filter NOT Added', 'red');
                }
            })
            .catch(error => {
                console.log(error);
            })
    } else {
        createAlert('Filter Already Added', 'yellow');
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
function useAJAXPostData(url, data) {
    return new Promise((resolve, reject) => {
        ajaxPostData(url, data)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function ajaxPostData(url, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        const formData = Object.keys(data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');

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

        xhr.send(formData);
    });
}


// open page that requires info
function openProfile(userID, event) {
    if (event) {
        event.stopPropagation();
        if (getParam('viewing_followers')) {
            closeViewFollowersOverlay();
        }
    }
    addToURL('user_id', userID);
    printPage('profile');
    document.getElementById('loadMoreButtonDiv').innerHTML += `
                                <a onclick="loadPostsForProfile(${userID})"><i class="fa-solid fa-circle-chevron-down"></i></a>
    `;
}
function openViewFollowersOverlay() {
    followersOffset = 0
    addToURL('viewing_followers', true);


    document.body.innerHTML += `
        <section id="viewFollowers">
            <div id="viewFollowersInner">
            </div>
        </section>
    `;

    document.getElementById('viewFollowers').addEventListener('click', function(event) {
        if (event.target === document.getElementById('viewFollowers')) {
            closeViewFollowersOverlay();
        }
    });
    loadFollowers(getParam('user_id'))
}
function loadFollowers(user_id) {
    let wow = {
        'user_id': user_id,
        'offset': followersOffset
    }
    ajaxGETData('php/loadFollowers.php', wow)
        .then(response=>{
            printFollowers(response);
        })
        .catch(error=>{
           console.log(error);
        });
    followersOffset += 25;
}
function printFollowers(followers) {
    let w = document.getElementById('viewFollowersInner');
    for (let i = 0; i < followers.length; i++) {


            w.innerHTML += `
            <div id="follower-${i}" onclick="openProfile(${followers[i]['id']}, event)" class='nice-box view-followers'>
                <img loading="lazy" src="userPFP/${followers[i]['pfp']}">
                <p>${followers[i]['username']}</p>
                <button id="followers-button-${i}" onclick="addFollowEvent(event, ${userIDD}, ${followers[i]['id']}, 'followers-button-${i}')"></button>
            </div>
        `;

        if (userIDD !== followers[i]['id']) {

            let wow = {
            'followed_id': followers[i]['id'],
            'follower_id': userIDD
        }
        ajaxGETData('php/checkFollow.php', wow)
            .then(response=>{
               if (response['following'] === false){
                   document.getElementById(`followers-button-${i}`).innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`;
               } else {
                   document.getElementById(`followers-button-${i}`).innerHTML = `<i class="fa-solid fa-user-minus"></i>Unfollow`;
               }
            })
            .catch(error=>{
                console.log(error);
            });
        } else {
            document.getElementById(`followers-button-${i}`).remove();
        }
    }
}
function closeViewFollowersOverlay() {
    removeFromURL('viewing_followers');
    document.getElementById('viewFollowers').remove();
}
function openViewFollowingOverlay() {
    followingOffset = 0
    addToURL('viewing_following', true);


    document.body.innerHTML += `
        <section id="viewFollowing">
            <div id="viewFollowersInner">
            </div>
        </section>
    `;

    document.getElementById('viewFollowers').addEventListener('click', function(event) {
        if (event.target === document.getElementById('viewFollowers')) {
            closeViewFollowersOverlay();
        }
    });
    loadFollowers(getParam('user_id'))
}
function loadFollowing(user_id) {
    let wow = {
        'user_id': user_id,
        'offset': followersOffset
    }
    ajaxGETData('php/loadFollowers.php', wow)
        .then(response=>{
            printFollowers(response);
        })
        .catch(error=>{
            console.log(error);
        });
    followersOffset += 25;
}
function printFollowing(followers) {
    let w = document.getElementById('viewFollowersInner');
    for (let i = 0; i < followers.length; i++) {


        w.innerHTML += `
            <div id="follower-${i}" onclick="openProfile(${followers[i]['id']}, event)" class='nice-box view-followers'>
                <img loading="lazy" src="userPFP/${followers[i]['pfp']}">
                <p>${followers[i]['username']}</p>
                <button id="followers-button-${i}" onclick="addFollowEvent(event, ${userIDD}, ${followers[i]['id']}, 'followers-button-${i}')"></button>
            </div>
        `;

        if (userIDD !== followers[i]['id']) {

            let wow = {
                'followed_id': followers[i]['id'],
                'follower_id': userIDD
            }
            ajaxGETData('php/checkFollow.php', wow)
                .then(response=>{
                    if (response['following'] === false){
                        document.getElementById(`followers-button-${i}`).innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`;
                    } else {
                        document.getElementById(`followers-button-${i}`).innerHTML = `<i class="fa-solid fa-user-minus"></i>Unfollow`;
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
        } else {
            document.getElementById(`followers-button-${i}`).remove();
        }
    }
}
function closeViewFollowingOverlay() {
    removeFromURL('viewing_followers');
    document.getElementById('viewFollowers').remove();
}
function openViewPostInteract(postID) {
    if (getParam('viewing_post')) {
        closeViewPostMenu();
    }
    openViewPost(postID);
}
function openViewPostEvent(event, postID) {
    event.stopPropagation();
    openViewPostInteract(postID);
}
function openViewPost(postID) {
    addToURL('post_id', postID);
    addToURL('viewing_post', true);
    document.body.innerHTML +=
        `<section id="viewPostSection">
   
      <div id="viewPostSectionInner">
            <div id="VPSMainPost">
            
            </div>
            <div>
               <form id="addCommentForm" action="php/addComment.php" method="POST">
                                    <textarea maxlength="255" placeholder="Say Something!" name="commentContent" id="commentContent"></textarea>
                                    <br>
                                                        <input type='text' value='${getParam('post_id')}' name="post_id" hidden required>            

                                    <a class="postButton" type="submit" onclick="formSubmit(event, 'addComment')"><i class="fa-solid fa-paper-plane"></i></a>
                                </form> 
            </div>
           
            <div id="viewPostSectionInnerPOSTPRINT">
            </div>   
                        <div id="loadMoreButtonDivVIEWPOST">
      <a onclick="loadPostsForViewPost(${postID}, true)"><i class="fa-solid fa-circle-chevron-down"></i></a>
</div>  
        </section>`;
    loadPostsForViewPost(postID, false);
    document.getElementById('viewPostSection').addEventListener('click', function(event) {
        if (event.target === document.getElementById('viewPostSection')) {
            closeViewPostMenu();
        }
    });



    // send the data off get the main post and all comments, print them accordingly
}
function openDeleteMenu(event, postID, userID, type, parentID) {
    let wow = type
    event.stopPropagation();
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
                               <button onclick="deletePost(${postID}, ${userID}, '${wow}', ${parentID})">Yes Delete my post</button>

</div>
</section>`;
    document.getElementById('deleteSection').addEventListener('click', function(event) {
        if (event.target === this) {
            closeDeleteMenu();
        }
    });
}

// close overlay
function closeDeleteMenu() {
    if (getParam('viewing_post')) {
        const save = getParam('post_id');
        closeViewPostMenu();
        openViewPost(save);
    }
    document.getElementById('deleteSection').remove();
    removeFromURL('deleting');
}
function closeViewPostMenu() {
    document.getElementById('viewPostSection').remove();
    removeFromURL('viewing_post');
    viewPostOffset = 0;
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
function addFollowEvent(event, followingID, followedID, buttonID) {
    event.stopPropagation();
    addFollowRandom(followingID, followedID, buttonID);
}
function addFollowRandom(followingID, followedID, buttonID) {
    let wow = {
        'followed': followedID,
        'following': followingID
    }
    ajaxGETData('php/addFollow.php', wow)
        .then (response=> {
            if (response['unfollowed']) {
                document.getElementById(buttonID).innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`;
                createAlert('Account Unfollowed', 'red');
            }
            if (response['following']) {
                document.getElementById(buttonID).innerHTML = `<i class="fa-solid fa-user-minus"></i>Unfollow`;
                createAlert('Account Followed', 'green');
            }
        })
        .catch (error=> {
            console.log(error);
        });
}
function addFollow(followingID, followedID) {
    let wow = {
        'followed': followedID,
        'following': followingID
    }
    ajaxGETData('php/addFollow.php', wow)
        .then (response=> {
            if (response['unfollowed']) {
                document.getElementById('followButton').innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`;
                let w = document.getElementById('followCount');
                let q = parseInt(w.innerText);
                w.innerText = q-1;
                createAlert('Account Unfollowed', 'red');
            }
            if (response['following']) {
                document.getElementById('followButton').innerHTML = `<i class="fa-solid fa-user-minus"></i>Unfollow`;
                let w = document.getElementById('followCount');
                let q = parseInt(w.innerText);
                w.innerText = q+1;
                createAlert('Account Followed', 'green');
            }
        })
        .catch (error=> {
            console.log(error);
        });
}
function addALike(event, postID) {
    event.stopPropagation();
    let wow = {
        'post_id': postID
    }
    useAJAXGetData('php/addLike.php', wow)
        .then(response => {
                if (response['removed_like']) {
                    createAlert('Like Removed', 'red');

                    if(document.getElementById(`viewpost_${postID}_likes_count`)) {
                        document.getElementById(`viewpost_${postID}_likes_count`).innerText = parseInt(document.getElementById(`viewpost_${postID}_likes_count`).innerText) - 1;
                    }

                    if(document.getElementById(`${postID}_likes_count`)) {
                        document.getElementById(`${postID}_likes_count`).innerText = parseInt(document.getElementById(`${postID}_likes_count`).innerText) - 1;
                    }
                }
                if (response['like_added']) {
                    createAlert('Like Added', 'green');
                    if(document.getElementById(`viewpost_${postID}_likes_count`)) {
                        document.getElementById(`viewpost_${postID}_likes_count`).innerText = parseInt(document.getElementById(`viewpost_${postID}_likes_count`).innerText) + 1;
                    }
                    if(document.getElementById(`${postID}_likes_count`)) {
                        document.getElementById(`${postID}_likes_count`).innerText = parseInt(document.getElementById(`${postID}_likes_count`).innerText) + 1;
                    }
                }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
let alertCount = 0;
function createAlert(alert, colour) {
    document.getElementById('alert-container').style.display = 'flex';
    document.getElementById('alert-container').innerHTML += `
                    <div class="alert" id="alert-box-${alertCount}">
                        <i class="fa-solid fa-exclamation"></i>
                        <p>${alert}</p>
                    </div>
                `;
    document.getElementById(`alert-box-${alertCount}`).style.backgroundColor = colour;
    let current = alertCount;
    setTimeout(function() {
        document.getElementById(`alert-box-${current}`).remove();
        document.getElementById('alert-container').style.display = 'none';
    }, 2500);
    alertCount++;
}

function deletePost(postID, userID, typee, parentID) {
    closeDeleteMenu();
    let wow = {
        'post_id': postID,
        'user_id': userID
    }
    useAJAXGetData('php/removePost.php', wow)
        .then(response => {
            if (response['post_deleted']) {
                if (getParam('viewing_post')) {

                    if (document.getElementById(`post_id_${postID}_viewpost`)) {
                        document.getElementById(`post_id_${postID}_viewpost`).remove();
                    }
                    if (document.getElementById(`post_id_${postID}`)) {
                        document.getElementById(`post_id_${postID}`).remove();
                    }
                    if (typee === String('main')) {
                        closeViewPostMenu();
                    } else {
                        closeViewPostMenu();
                        if (document.getElementById(`${parentID}_comment_count`)) {
                            document.getElementById(`${parentID}_comment_count`).innerText = parseInt(document.getElementById(`${parentID}_comment_count`).innerText) - 1;
                            openViewPost(parentID);
                        } else {
                            openViewPost(parentID);
                        }
                    }
                } else {
                    document.getElementById(`post_id_${postID}`).remove();
                }
                createAlert('Post Deleted', 'red');
            } else {
                createAlert('Post NOT Deleted', 'yellow');
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });

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
            console.log('still need to add filtered posts');
            console.log('------------');
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
function loadPostsForViewPost(postID, loadMore) {
    let wow = {
        'offset': viewPostOffset,
        'post_id': postID
    }
    ajaxGETData('php/loadPostandComments.php', wow)
        .then(response=>{
            printPostContentVIEWPOST(response, 'viewPostSectionInnerPOSTPRINT', loadMore);
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
async function loadPostsForLeaderboard() {
    useAJAXGetData('php/loadPostsForLeaderboard.php')
        .then(posts => {
            printPostContent(posts, 'leaderboardPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function loadPostsForLeaderboardDay() {
    useAJAXGetData('php/loadPostsForLeaderboardDay.php')
        .then(posts => {
            console.log(posts);
            printPostContent(posts, 'leaderboardPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function loadPostsForLeaderboardMonthly() {
    useAJAXGetData('php/loadPostsForLeaderboardMonth.php')
        .then(posts => {
            printPostContent(posts, 'leaderboardPostsSection');
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function loadPostsForLeaderboardYearly() {
    useAJAXGetData('php/loadPostsForLeaderboardYear.php')
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
    document.title = `${page} | Statement Of The Day`;

    document.body.innerHTML =
            pageInfo['header']['content']+
            pageInfo[page]['content']+
            pageInfo['footer']['content']

    // logic based on page var

    if (getParam('viewing_post')) {
        openViewPost(getParam('post_id'));
    }
    if (getParam('deleting')) {
        openDeleteMenu(getParam('post_id'), getParam('user_id'));
    }
    if (getParam('viewing_followers')) {
        openViewFollowersOverlay();
    }
        if (page === 'home' || page ==='viewFollowingPosts' || page === 'viewFilteredPosts') {
            document.getElementById('printPostsSectionn').innerHTML += `
                                        <section>
                                <form id="makeAPostForm" method="POST">
<textarea maxlength="255" placeholder="Say Something!" id="makeAPost" name="makeAPost"></textarea>

<button class="postButton" id="makeAPostButton" type="submit" onclick="formSubmit(event, 'makeAPost')"><i class="fa-solid fa-paper-plane"></i></button>
                                </form>
                            </section>
                            <br>
                            <br>
                            
                            <div id="home-post-buttons">
      <a id="viewHome" onclick="printPage('home')"><i class="fa-solid fa-earth-americas"></i></a>
                                    <a id="viewFollowing" onclick="printPage('viewFollowingPosts')"><i class="fa-solid fa-person-circle-plus"></i></a>
                                    <a id="viewFiltered" onclick="printPage('viewFilteredPosts')"><i class="fa-solid fa-list-check"></i></a>                      
</div>
            `;

            let w = document.getElementById('homeButton');
            w.style.backgroundColor = '#f7fff7';
            w.style.color = '#a94e4e';
        }
        if (page === 'home') {
            loadPostsForHome();
            let w= document.getElementById('viewHome').style;
            w.color = '#a94e4e';
            w.backgroundColor = '#f7fff7';
        }
        if (page === 'viewFollowingPosts') {
            loadPostsForFollowing();
            let w= document.getElementById('viewFollowing').style;
            w.color = '#a94e4e';
            w.backgroundColor = '#f7fff7';
        }
        if (page === 'viewFilteredPosts') {
            loadPostsForFiltering();
            let w= document.getElementById('viewFiltered').style;
            w.color = '#a94e4e';
            w.backgroundColor = '#f7fff7';
        }
        if (page === 'leaderboard' || page === 'leaderboardDay' || page === 'leaderboardMonth' || page==='leaderboardYear') {
            document.getElementById('leaderboardPostsSection').innerHTML = `
                            <div id="leaderboardButtons">
                                <a onclick="printPage('leaderboard')">Current</a>                            
                                <a onclick="printPage('leaderboardMonth')">Monthly</a>
                                <a onclick="printPage('leaderboardYear')">Yearly</a>
                                <a onclick="printPage('leaderboardDay')">History</a>
                            </div>
            `;

            let w = document.getElementById('leaderboardButton');
            w.style.backgroundColor = '#f7fff7';
            w.style.color = '#a94e4e'
        }
        if (page === 'leaderboard') {
            loadPostsForLeaderboard();
        }
        if (page === 'leaderboardDay') {
            loadPostsForLeaderboardDay();
        }
        if (page === 'leaderboardMonth') {
            loadPostsForLeaderboardMonthly();
        }
        if (page === 'leaderboardYear') {
            loadPostsForLeaderboardYearly();
        }
        if (page === 'settings') {
            loadMedalsForSettings();
            printFiltersForSettings();
            let w = document.getElementById('settingsButton');
            w.style.backgroundColor = '#f7fff7';
            w.style.color = '#a94e4e'
        }
        if (page === 'profile') {
            loadPostsForProfile(getParam('user_id'));

            let w = document.getElementById('profileButton');
            w.style.backgroundColor = '#f7fff7';
            w.style.color = '#a94e4e'
        }
}

function printProfileContent(user_info, idOfPrint) {
    if (profileCount === 0) {

        document.getElementById(idOfPrint).innerHTML += `
        <section id="profileHeader">
            <div class="">
                
            </div>
            <img draggable="false" alt="${user_info['username']}-pfp" loading="lazy" src="userPFP/${user_info['pfp']}">
            <div id="profileUsername">
                 <h1>@${user_info['username']}</h1>

            </div>
            <br>
            <br>
            <div class="flex-row">
                <a class="flex-row">
                    <p id="followingLabel">Following: </p>
                    <p id="followingCount">${user_info['following_count']}</p>
                </a>
                <a class="flex-row" onclick="openViewFollowersOverlay()">
                    <p id="followersLabel">Followers:</p>
                    <p id="followCount">${user_info['follow_count']}</p>
                </a>
            </div>
</div>
            <div id="followButtonDiv"></div>
        </section>
    `;

        if (user_info['medal_selection'] !== null) {
            let w = document.getElementById('profileUsername');
            w.innerHTML += `
                <a id="profileMedal" class="addMedal" onclick="openViewPost(${user_info['medal_selection'][1]})"><i class="fa-solid fa-award"></i></a>
            `;
            let profileMedal = document.getElementById('profileMedal');
            profileMedal.style.color = 'var(--one)';
            if (user_info['medal_selection'][3] === 1) {
                profileMedal.style.backgroundColor = 'gold';
            }
            if (user_info['medal_selection'][3] === 2) {
                profileMedal.style.backgroundColor = 'silver';
            }
            if (user_info['medal_selection'][3] === 3) {
                profileMedal.style.backgroundColor = 'brown';
            }
        }

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
                        document.getElementById('followButton').innerHTML = `<i class="fa-solid fa-user-minus"></i>Unfollow`;
                    } else {
                        document.getElementById('followButton').innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`;
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
            document.getElementById('loadMoreButtonDiv').innerHTML = `
                  <p>There are no more posts.</p>
            `;
        }


    for (let i = 0; i<posts.length; i++) {
        let p = posts[i];

            let woww = null;
            if(p['medal_selection'] !== null) {
                woww = p['medal_selection'][1]
            }

            document.getElementById(idOfPrint).innerHTML += `
            <div class="post" id="post_id_${p['post_id']}" onclick="openViewPostInteract(${p['post_id']})">
                            <div class="paddingg">
                                                        <div class="flex-row align-bottom">
                <img class="postImg" alt="${p['username']}-pfp" loading="lazy" src="userPFP/${p['pfp']}" draggable="false" onclick="openProfile(${p['user_id']}, event)">
                <a class="profileLink" onclick="openProfile(${p['user_id']}, event)">@${p['username']}</a> 
                <a id="add-medal-${p['post_id']}" class="addMedal" onclick="openViewPostEvent(event, '${woww}')"></a>
</div>
                <h2>${p['content']}</h2>
                </div>

                <div class="flex-row post-buttons" id="post_id_add_delete_${p['post_id']}">
                <a onclick="addALike(event, ${p['post_id']})"><i class="fa-solid fa-heart"></i></a>
                <p id="${p['post_id']}_likes_count">${p['likes']}</p>         
                <a><i class="fa-solid fa-comment"></i></a>
                <p id="${p['post_id']}_comment_count">${p['comments']}</p>         
</div>         
  
            `;
        if (p['user_id'] === userIDD) {
            document.getElementById('post_id_add_delete_'+p['post_id']).innerHTML += `
                <a onclick="openDeleteMenu(event, ${p['post_id']}, ${p['user_id']})"><i class="fa-solid fa-trash"></i></a>
            `;
        }

        let w = document.getElementById(`add-medal-${p['post_id']}`);
        if (p['medal_selection'] !== null) {
            w.innerHTML = `<i class="fa-solid fa-award"></i>`;
            if (p['medal_selection'][3] === 1) {
                w.style.color = 'var(--one)';
                w.style.background = 'linear-gradient(45deg, #ffd700, #ffd700 50%, #ffd700)';
            }
            if (p['medal_selection'][3] === 2) {
                w.style.color = 'var(--one)';
                w.style.background = 'linear-gradient(45deg, #c0c0c0, #c0c0c0 50%, #c0c0c0)';
            }
            if (p['medal_selection'][3] === 3) {
                w.style.color = 'var(--one)';
                w.style.background = 'linear-gradient(45deg, #cd7f32, #cd7f32 50%, #cd7f32)';
            }
        } else {
            document.getElementById(`add-medal-${p['post_id']}`).remove();
        }
    }


    let w = getParam('page');

    if (w=== 'home' || w==='viewFollowingPosts' || w==='viewFilteredPosts') {
        postsOffset+=25;
    }
    if (w=== 'profile') {
        profileOffset += 25;
    }
}


function printPostContentVIEWPOST(posts, idOfPrint, loadMore) {
    if (posts.length <= 24) {
        if (getParam('viewing_post')) {
            document.getElementById('loadMoreButtonDivVIEWPOST').innerHTML = `
                  <p>There are no more comments!</p>
            `;
        }
    }

    for (let i = 0; i<posts.length; i++) {
        let p = posts[i];

        let woww = null;
        if(p['medal_selection'] !== null) {
            woww = p['medal_selection'][1];
        }

        let parentID = posts[0]['post_id'];
        if (i === 0 && loadMore === false) {
            document.getElementById('VPSMainPost').innerHTML += `
            <div class="post main-post" id="post_id_${p['post_id']}_viewpost">
                                                        <div class="paddingg">

                            <div class="flex-row align-bottom">
                <img class="postImg" alt="${p['username']}-pfp" loading="lazy" src="userPFP/${p['pfp']}" draggable="false" onclick="openProfile(${p['user_id']}, event); closeViewPostMenu()">
                <a class="profileLink" onclick="openProfile(${p['user_id']}, event); closeViewPostMenu()">@${p['username']}</a> 
                <a id="add-medal-${p['post_id']}-viewpost"  class="addMedal"  onclick="openViewPostEvent(event, '${woww}')"></a>

</div>
                <h2>${p['content']}</h2>
                </div>
                <div class="flex-row post-buttons"  id="post_id_add_delete_view_${p['post_id']}">
                                       <a onclick="addALike(event, ${p['post_id']})"><i class="fa-solid fa-heart"></i></a>
                <p id="viewpost_${p['post_id']}_likes_count">${p['likes']}</p>         
                <a><i class="fa-solid fa-comment"></i></a>
                <p id="${p['post_id']}_comment_count">${p['comments']}</p> 
</div>         
  
            `;
            if (p['user_id'] === userIDD) {
                document.getElementById('post_id_add_delete_view_'+p['post_id']).innerHTML += ` 
                <a onclick="openDeleteMenu(event, ${p['post_id']}, ${p['user_id']}, String('main'))"><i class="fa-solid fa-trash"></i></a>
            `;
            }
        } else {
            document.getElementById(idOfPrint).innerHTML += `
            <div class="post" id="post_id_${p['post_id']}_viewpost" onclick="openViewPostInteract(${p['post_id']})">
                            <div class="paddingg">
                                                       <div class="flex-row align-bottom">
                <img class="postImg" alt="${p['username']}-pfp" loading="lazy" src="userPFP/${p['pfp']}" draggable="false" onclick="openProfile(${p['user_id']}, event); closeViewPostMenu()">
                <a class="profileLink" onclick="openProfile(${p['user_id']}, event); closeViewPostMenu()">@${p['username']}</a> 
                <a  class="addMedal"  id="add-medal-${p['post_id']}-viewpost" onclick="openViewPostEvent(event, '${woww}')"></a>

</div>
                <h2>${p['content']}</h2>
                </div>

                <div class="flex-row post-buttons"  id="post_id_add_delete_view_${p['post_id']}">
<a onclick="addALike(event, ${p['post_id']})"><i class="fa-solid fa-heart"></i></a>
                <p id="viewpost_${p['post_id']}_likes_count">${p['likes']}</p>         
                <a><i class="fa-solid fa-comment"></i></a>
                <p id="${p['post_id']}_comment_count">${p['comments']}</p> 
</div>         
  
            `;

            if (p['user_id'] === userIDD) {
                document.getElementById('post_id_add_delete_view_'+p['post_id']).innerHTML += `
                <a onclick="openDeleteMenu(event, ${p['post_id']}, ${p['user_id']}, String('comment'), ${parentID})"><i class="fa-solid fa-trash"></i></a>
            `;
            }
        }
        let w = document.getElementById(`add-medal-${p['post_id']}-viewpost`);
        if (p['medal_selection'] !== null) {
            w.innerHTML = `<i class="fa-solid fa-award"></i>`;
            if (p['medal_selection'][3] === 1) {
                w.style.color = 'var(--one)';
                w.style.background = 'linear-gradient(45deg, #ffd700, #ffd700 50%, #ffd700)';
            }
            if (p['medal_selection'][3] === 2) {
                w.style.color = 'var(--one)';
                w.style.background = 'linear-gradient(45deg, #c0c0c0, #c0c0c0 50%, #c0c0c0)';
            }
            if (p['medal_selection'][3] === 3) {
                w.style.color = 'var(--one)';
                w.style.background = 'linear-gradient(45deg, #cd7f32, #cd7f32 50%, #cd7f32)';
            }
        } else {
            document.getElementById(`add-medal-${p['post_id']}`).remove();
        }
    }

    if (getParam('viewing_post')) {
        viewPostOffset += 25;
    }
}


// start app
app();
