// ihawp 2024

// var for app
let logged = false;
let usernamee = undefined;
let userIDD = undefined;
const d = new Date();
let year = d.getFullYear();

let pageInfo = {
}

function app() {
    getUserInfo('php/checkLogged.php')
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
            if (logged===false) {
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
            } else if (logged===true) {
                pageInfo = {
                    'header': {
                        'content': `
                            <header>
                            <h1>this is the header! logged in!</h1>
                            <nav>
                            <a onclick="printPage('home')">home</a>                      
                            <a onclick="printPage('settings')">settings</a>                      
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
                                <form id="makeAPostForm" action="php/makeAPost.php" method="POST">
                                    <input type="text" placeholder="Say Something!" id="makeAPost" name="makeAPost">
                                    <button type="submit" onclick="formSubmit(event, 'makeAPost')">post it</button>
                                </form>
                            </section>
        `
                    },
                    'settings': {
                        'content': `
                            <h1>you are logged in!</h1>
                            <a href="php/logout.php">logout</a>
                `
                    }
                }
            }

            // page logic
            let page = getPage();
            if (page.length > 0) {
                printPage(page);
            } else {
                printPage('home');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function formSubmit(event, type) {
        const registerFormSubmission = document.getElementById('registerForm');
        const loginFormSubmission = document.getElementById('loginForm');
        const makeAPostForm = document.getElementById("makeAPostForm");
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
        }
}
function formSubmit2(event) {
    event.preventDefault();
}
function getUserInfo(url) {
    return new Promise((resolve, reject) => {
        ajaxGET(url)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function ajaxGET(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
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

function printPage(page) {
    if(pageInfo.hasOwnProperty(page)) {
        changeURL(page);
        document.body.innerHTML = `${usernamee}, ${userIDD}` +
            pageInfo['header']['content']+
            pageInfo[page]['content']+
            pageInfo['footer']['content'];
    } else {
        printPage('404');
    }
}
function changeURL(page) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', page);
    const newURL = `${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState({}, '', newURL);
}
function getPage() {
    const urlParams = new URLSearchParams(window.location.search);
    let w = urlParams.get('page');
    if (w === null) {
        return 'home';
    } else {
        return w;
    }
}



// start app
app();
