// ihawp 2024

let logged = false;
let usernamee = undefined;
let userIDD = undefined;
let pfpp = undefined;
const d = new Date();
let year = d.getFullYear();
let postsOffset = 0;
let profileOffset = 0;
let postOffset = 0;
let viewPostOffset = 0;
const postsLimit = 25;
let followersOffset = 0;
let followingOffset = 0;
let notificationsOffet = 0;
let userFilters = new Array();
let medals = new Array();
let selectedMedal = undefined;
let profileCount = 0;
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
                            <a id="notificationsButton" onclick="printPage('notifications')"><div id="notificationRedDot"><p id="updateNotificationCount">1</p></div><i class="fa-solid fa-bell"></i></a>                      
                            <a id="profileButton" onclick="openProfile(userIDD, event)"><i class="fa-solid fa-user"></i></a>                      
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
<div class="nice-box settings-first align-end">

        <form id="addPFPForm" class="flex-row align-center" method="POST" action="php/changePFP.php" enctype="multipart/form-data">
            <h1>Profile Picture</h1>
            <div class="flex-column">
            <div class="pfpImageOverlay">
                <img id="previewImage" class="settingsPFP" loading="lazy" src="${pfpp}" width="125px" height="125px">
                <div class="addPFPOverlay">
                    <i class="fa-solid fa-camera"></i>
                    <input type="file" name="file" id="file" accept=".png, .jpg, .jpeg" onchange="previewFile()">
                </div>
            </div>
            <button class="margin-top-10" type="submit" onclick="formSubmit(event, 'changePFP')">Submit</button>

            </div>
        </form>

<form id="usernameForm" class="flex-row align-center justify-center">
    <h1 for="usernameeee">Username</h1>
    <input id="usernameeee" value="${usernamee}" disabled>
</form>
<form id="passwordForm" method="POST" action="php/changePassword.php" class="flex-row align-center justify-center">
    <h1 for="newPassword">Change Password</h1>
    <input id="newPassword" type="password" placeholder="New Password" name="password" maxlength="25">
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

    <form id="filtersForm" class="flex-row justify-center align-center">
        <h1>Filters</h1>
        <div class="flex-row">
       <input type="text" placeholder="Type Filter Here" id="addFilterValue">
        <button type="submit" onclick="addFilters(event)"><i class="fa-solid fa-plus"></i>Add</button>
</div>
       </form>
    <div id="filtersFormCollected">
    
    </div>
</div>
</div>
</section>
                          
                `
                    },
                    'notifications': {
                      'content': `
                        <section id="notificationsSection">
                        
                        </section>
                        <div id="loadMoreButtonDiv">
                            <a onclick="loadNotifications()"><i class="fa-solid fa-circle-chevron-down"></i></a>
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
                            <section id="profilePostsSection"></section>
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
        const blockFormm = document.getElementById('blockForm');

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
                            createAlert('Post Added Successfully!', 'green');
                            document.getElementById('makeAPost').value = '';
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
            case ('block'):
                let leett = getParam('user_id');

                let ban = {
                    'user_id': leett
                }

                ajaxGETData('php/blockUser.php', ban)
                    .then(response=> {
                        if (response['stmt'] === 'blocked') {
                            createAlert('User Blocked', 'red');
                            // change button to unblock
                            document.getElementById('blockButton').innerHTML = 'Unblock';
                            document.getElementById('profilePostsSection').remove();
                            document.getElementById('loadMoreButtonDiv').remove();
                        }
                        if (response['stmt']==='unblocked') {
                            createAlert('User Unblocked', 'green');
                            document.getElementById('blockButton').innerHTML = '<i class="fa-solid fa-ban"></i> Block';
                            window.location.reload();
                        }
                    })
                    .catch(error=> {
                        console.log(error);
                    })
                break;
        }
}
function loadNotificationsButton() {
    notificationsOffet = 0;
    loadNotifications();
}
function loadNotifications() {
    document.getElementById('notificationRedDot').style.display = 'none';
    let wow = {
        'user_id': userIDD,
        'offset': notificationsOffet
    }
    ajaxGETData('php/loadNotifications.php', wow)
        .then(response=>{
            printNotifications(response);
            notificationsOffet += 25;
        })
        .catch(error=> {
            console.log(error);
        });
}
function printNotifications(notifications) {
    let domm = document.getElementById('notificationsSection');
    if (notifications.length === 0) {
        document.getElementById('loadMoreButtonDiv').innerHTML = `
            <p>No More Notifications.</p>
        `;
    }

    for (let i =0; i<notifications.length;i++) {
        let d = notifications[i];


        if (d['viewed']===0) {
            if (d['noti_type'] === 'like' || d['noti_type'] === 'comment' || d['noti_type'] === 'medal') {
                domm.innerHTML += `
                    <div id="notification-${d['id']}" onclick="openViewPostEvent(event, ${d['post_id']})" class="notification noti-first-time">
                        
                        <p id="noti-text-${d['id']}"></p>
                        <div class="noti-right-box" id="noti-right-box-${d['id']}">
                           
                        </div>
                    </div>
                `;
            } else if (d['noti_type'] === 'follow') {
                domm.innerHTML += `
                    <div id="notification-${d['id']}" onclick="openProfile(${d['post_id']})" class="notification noti-first-time">
                        <p id="noti-text-${d['id']}"></p>
                        <div class="noti-right-box" id="noti-right-box-${d['id']}">
                           
                        </div>
                    </div>
                `;
            }
            if (d['noti_type'] === 'like') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    <b>${d['username']}</b> liked your post!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-heart"></i>
                `;
            }
            if (d['noti_type'] === 'follow') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    <b>${d['username']}</b> followed you!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-user-plus"></i>
                `;
            }
            if (d['noti_type'] === 'comment') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    <b>${d['username']}</b> commented on your post!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-comment"></i>
                `;
            }
            if (d['noti_type'] === 'medal') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    Congratulations <b>${d['username']}</b>, you got a medal!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-award"></i>
                `;
            }
        } else {
            if (d['noti_type'] === 'like' || d['noti_type'] === 'comment' || d['noti_type'] === 'medal') {
                domm.innerHTML += `
                    <div id="notification-${d['id']}" onclick="openViewPostEvent(event, ${d['post_id']})" class="notification">
                        
                        <p id="noti-text-${d['id']}"></p>
                        <div class="noti-right-box" id="noti-right-box-${d['id']}">
                           
                        </div>
                    </div>
                `;
            } else if (d['noti_type'] === 'follow') {
                domm.innerHTML += `
                    <div id="notification-${d['id']}" onclick="openProfile(${d['post_id']})" class="notification">
                        <p id="noti-text-${d['id']}"></p>
                        <div class="noti-right-box" id="noti-right-box-${d['id']}">
                           
                        </div>
                    </div>
                `;
            }
            if (d['noti_type'] === 'like') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    <b>${d['username']}</b> liked your post!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-heart"></i>
                `;
            }
            if (d['noti_type'] === 'follow') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    <b>${d['username']}</b> followed you!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-user-plus"></i>
                `;
            }
            if (d['noti_type'] === 'comment') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    <b>${d['username']}</b> commented on your post!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-comment"></i>
                `;
            }
            if (d['noti_type'] === 'medal') {
                document.getElementById(`noti-text-${d['id']}`).innerHTML = `
                    Congratulations <b>${d['username']}</b>, you got a medal!
                `;
                document.getElementById(`noti-right-box-${d['id']}`).innerHTML = `
                <i class="fa-solid fa-award"></i>
                `;
            }
        }

    }
}
function loadNotificationsCount() {
    let wow = {
        'user_id': userIDD
    }
    ajaxGETData('php/loadNotificationCount.php', wow)
        .then(response=> {
             if (response['count'] !== 0) {
                document.getElementById('notificationRedDot').style.display = 'flex';

                if (response['count'] > 99) {
                    document.getElementById('updateNotificationCount').innerHTML = `
                99+
            `;
                } else {
                    document.getElementById('updateNotificationCount').innerHTML = `
                ${response['count']}
            `;
                }
            }
        })
        .catch(error=> {
           console.log(error);
        });
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
                    <button onclick="deleteFilter('${userFilters[i]}')"><i class="fa-solid fa-trash-can"></i></button>
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
    console.log(medalss);


    if (medalss.length === 0) {
        document.getElementById(`medalsContainer`).remove();
    } else {
        if (selectedMedal !== null) {
            document.getElementById('width-40').innerHTML = `
            <h1>Selected Medal</h1>
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
                        <h1>Selected Medal</h1>
            <a id="currentMedal" onclick="openViewPost()"><i class="fa-solid fa-award"></i></a>
                        <button type="submit" onclick="formSubmit(event, 'changeMedal')">Submit</button>
        
        `;
        }

        for (let i = 0; i < medalss.length;) {
            const timestamp = medalss[i].timestamp;
            const date = new Date(timestamp);
            const day = new Intl.DateTimeFormat("en-US", {day: "numeric"}).format(date);
            const month = new Intl.DateTimeFormat("en-US", {month: "long"}).format(date);
            const year = new Intl.DateTimeFormat("en-US", {year: "numeric"}).format(date);

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
                }  else {

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


            const w = document.getElementById(`addMedal-${i}`);
            if (document.getElementById(`addMedal-${i}`)) {
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
                    <button onclick="deleteFilter('${q}')"><i class="fa-solid fa-trash-can"></i></button>
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
    }
    if (getParam('viewing_following')) {
        closeViewFollowingOverlay();
    }
    if (getParam('viewing_followers')) {
        closeViewFollowersOverlay();
    }

    addToURL('user_id', userID);
    printPage('profile');
    document.getElementById('loadMoreButtonDiv').innerHTML += `
                                <a onclick="loadPostsForProfile(${userID})"><i class="fa-solid fa-circle-chevron-down"></i></a>
    `;
}
function openViewFollowersOverlay(idd) {
    followersOffset = 0
    addToURL('viewing_followers', true);


    document.body.innerHTML += `
<section id="viewFollowers">
            <div id="viewFollowersInner">
                <div id="loadFollowers">
                
                </div>
                            <div class="loadMore" id="loadMoreFollowers">
            <a onclick="loadFollowers(${idd})"><i class="fa-solid fa-circle-chevron-down"></i></a>
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
            if (response.length !== 0) {
                printFollowers(response);
            } else {
                document.getElementById('loadMoreFollowers').innerHTML = `
            <p>No More Accounts.</p>
        `;
            }
        })
        .catch(error=>{
           console.log(error);
        });
}
function printFollowers(followers) {
    followersOffset += followers.length;
    let w = document.getElementById('loadFollowers');
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
function openViewFollowingOverlay(idd) {
    followingOffset = 0
    addToURL('viewing_following', true);


    document.body.innerHTML += `
        <section id="viewFollowing">
            <div id="viewFollowingInner">
                <div id="loadFollowing">
                
                </div>
                            <div class="loadMore" id="loadMoreFollowing">
            <a onclick="loadFollowing(${idd})"><i class="fa-solid fa-circle-chevron-down"></i></a>
</div>
            </div>
        </section>
    `;

    document.getElementById('viewFollowing').addEventListener('click', function(event) {
        if (event.target === document.getElementById('viewFollowing')) {
            closeViewFollowingOverlay();
        }
    });
    loadFollowing(getParam('user_id'))
}
function loadFollowing(user_id) {
    let wow = {
        'user_id': user_id,
        'offset': followingOffset
    }
    ajaxGETData('php/loadFollowing.php', wow)
        .then(response=>{
            if (response.length !== 0) {
                printFollowing(response);
            } else {
                document.getElementById('loadMoreFollowing').innerHTML = `
            <p>No More Accounts.</p>
        `;
            }
        })
        .catch(error=>{
            console.log(error);
        });
}
function printFollowing(followers) {
    followingOffset += followers.length;
    let w = document.getElementById('loadFollowing');
    for (let i = 0; i < followers.length; i++) {


        w.innerHTML += `
            <div id="following-${i}" onclick="openProfile(${followers[i]['id']}, event)" class='nice-box view-followers'>
                <img loading="lazy" src="userPFP/${followers[i]['pfp']}">
                <p>${followers[i]['username']}</p>
                <button id="following-button-${i}" onclick="addFollowEvent(event, ${userIDD}, ${followers[i]['id']}, 'following-button-${i}')"></button>
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
                        document.getElementById(`following-button-${i}`).innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`;
                    } else {
                        document.getElementById(`following-button-${i}`).innerHTML = `<i class="fa-solid fa-user-minus"></i>Unfollow`;
                    }
                })
                .catch(error=>{
                    console.log(error);
                });
        } else {
            document.getElementById(`following-button-${i}`).remove();
        }
    }
}
function closeViewFollowingOverlay() {
    removeFromURL('viewing_following');
    document.getElementById('viewFollowing').remove();
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
        // will always try to remove and show error in console
        // trycatch case prevent this by doing nothing when the
        // error occurs
        try {
            document.getElementById(`alert-box-${current}`).remove();
        } catch{}
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
            if (response['post_deleted'] === true) {
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
            printProfileContent(response['user_info'], response['posts'], 'profilePostsSection');
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
    if (page !== 'notifications') {
        loadNotificationsCount();
    }
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
    if (getParam('viewing_following')) {
        openViewFollowingOverlay();
    }
        if (page === 'home' || page ==='viewFollowingPosts') {
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
      <a id="viewHome" onclick="printPage('home')"><p>Recent</p></a>
                                    <a id="viewFollowingg" onclick="printPage('viewFollowingPosts')"><p>Following</p></a>
</div>
            `;

            let w = document.getElementById('homeButton');
            w.style.backgroundColor = 'var(--two)';
            w.style.color = 'var(--one)';
        }
        if (page === 'home') {
            loadPostsForHome();
            let w= document.getElementById('viewHome').style;
            w.color = 'var(--one)';
            w.backgroundColor = 'var(--two)';
        }
        if (page === 'viewFollowingPosts') {
            loadPostsForFollowing();
            let w= document.getElementById('viewFollowingg').style;
            w.color = 'var(--one)';
            w.backgroundColor = 'var(--two)';
        }

        if (page === 'leaderboard' || page === 'leaderboardMonth' || page==='leaderboardYear') {
            document.getElementById('leaderboardPostsSection').innerHTML = `
                            <div id="leaderboardButtons">
                                <a id="leaderboardCurrentButton" onclick="printPage('leaderboard')">Current</a>                            
                                <a id="leaderboardMonthlyButton" onclick="printPage('leaderboardMonth')">Monthly</a>
                                <a id="leaderboardYearlyButton" onclick="printPage('leaderboardYear')">Yearly</a>
                            </div>
            `;

            let w = document.getElementById('leaderboardButton');
            w.style.backgroundColor = 'var(--two)';
            w.style.color = 'var(--one)';
        }
        if (page === 'leaderboard') {
            loadPostsForLeaderboard();

            let w = document.getElementById('leaderboardCurrentButton');
            w.style.backgroundColor = 'var(--two)';
            w.style.color =  'var(--one)';
        }
        if (page === 'leaderboardMonth') {
            let w = document.getElementById('leaderboardMonthlyButton');
            w.style.backgroundColor = 'var(--two)';
            w.style.color =  'var(--one)';
            loadPostsForLeaderboardMonthly();
        }
        if (page === 'leaderboardYear') {
            let w = document.getElementById('leaderboardYearlyButton');
            w.style.backgroundColor = 'var(--two)';
            w.style.color =  'var(--one)';
            loadPostsForLeaderboardYearly();
        }
        if (page === 'settings') {
            loadMedalsForSettings();
            printFiltersForSettings();
        }
        if (page === 'notifications') {
            loadNotificationsButton();
            let w = document.getElementById('notificationsButton');
            w.style.backgroundColor = 'var(--two)';
            w.style.color = 'var(--one)';
        }
        if (page === 'profile') {


            loadPostsForProfile(getParam('user_id'));
            if (getParam('user_id')==userIDD) {
                let w = document.getElementById('profileButton');
                w.style.backgroundColor = 'var(--two)';
                w.style.color = 'var(--one)';
            }
        }
        if (page === 'profileOverlay') {
            console.log(page);
        }
}

function printProfileContent(user_info, posts, idOfPrint) {
    if (profileCount === 0) {

        document.getElementById('profileSection').innerHTML += `
        <section id="profileHeader">
            <img draggable="false" alt="${user_info['username']}-pfp" loading="lazy" src="userPFP/${user_info['pfp']}">
            <div id="profileUsername">
                 <h1>@${user_info['username']}</h1>
            </div>
            <br>
            <br>
            <div class="flex-row">
                <a class="flex-row" onclick="openViewFollowingOverlay(${user_info['id']})">
                    <p id="followingLabel">Following: </p>
                    <p id="followingCount">${user_info['following_count']}</p>
                </a>
                <a class="flex-row" onclick="openViewFollowersOverlay(${user_info['id']})">
                    <p id="followersLabel">Followers:</p>
                    <p id="followCount">${user_info['follow_count']}</p>
                </a>
            </div>
</div>
            <div id="followButtonDiv" class="flex-row align-center justify-center"></div>
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
                
                <form id="blockForm" method="POST">
                <input name="blocking" value="${user_info['id']}" hidden>
<button id="blockButton" type="submit" onclick="formSubmit(event, 'block')"></button>                
</form>
            
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


            let datat = {
                    'blocked_id': user_info['id'],
                    'blocker_id': userIDD
            }
            ajaxGETData('php/checkBlocked.php', datat)
                .then(response=> {
                  if (response['blocked'] === true) {
                      document.getElementById('blockButton').innerText = 'Unblock';
                      document.getElementById('loadMoreButtonDiv').remove();
                  } else {
                      document.getElementById('blockButton').innerHTML = `<i class="fa-solid fa-ban"></i> Block`;
                      printPostContent(posts, 'profilePostsSection');
                  }
                })
                .catch(error=> {
                   console.log(error);
                });
        } else {
            printPostContent(posts, 'profilePostsSection');
            document.getElementById('profileHeader').innerHTML += `
                        <a id="openSettingsProfile" onclick="printPage('settings')"><i class="fa-solid fa-gear"></i></a>
            `;
        }
        profileCount += 1;
    } else {
        printPostContent(posts, 'profilePostsSection');
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

        // leaderboard page case
        if (getParam('page') === 'leaderboard' || getParam('page') === 'leaderboardMonth' || getParam('page') === 'leaderboardYear') {
            document.getElementById(`post_id_${p['post_id']}`).innerHTML += `
                <div class="leaderboardNumber flex-row align-center justify-center">
                <p>#</p>
                <h1>${i+1}</h1>
                </div>
            `;
            let current = document.getElementById(`post_id_${p['post_id']}`);
            if (i === 0 || i===1||i===2) {
                current.style.marginTop = '10px';
                current.style.marginBottom = '10px';
            }
            if (i === 0) {
                current.style.boxShadow = '0 0 10px rgb(255,215,0)';
                current.style.borderColor = 'rgb(255,215,0)';
                current.style.marginTop = '20px';
            }
            if (i === 1) {
                current.style.boxShadow = '0 0 10px silver';
                current.style.borderColor = 'silver';
            }
            if (i === 2) {
                current.style.boxShadow = '0 0 10px red';
                current.style.borderColor = 'red';
            }
            if (i===3) {
                current.style.marginTop = '10px';
            }
        }

    }


    let w = getParam('page');

    if (w=== 'home' || w==='viewFollowingPosts') {
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
                <a class="addMedal" id="add-medal-${p['post_id']}-viewpost" onclick="openViewPostEvent(event, '${woww}')"></a>

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
            document.getElementById(`add-medal-${p['post_id']}-viewpost`).remove();
        }
    }

    if (getParam('viewing_post')) {
        viewPostOffset += 25;
    }
}


// start app
app();
setTimeout(function() {
    setInterval(loadNotificationsCount, 10000);
}, 5000);
