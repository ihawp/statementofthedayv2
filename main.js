// ihawp

// var for app
let logged = false;
let usernamee = undefined;
let userIDD = undefined;

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
                    'home': {
                        'content': `
            <section>
                <a onclick="printPage('login')">login</a>
                <a onclick="printPage('register')">register</a>
            </section>
        `
                    },
                    'login': {
                        'content': `
            <h1>login</h1>
            <form method="POST" action="php/login.php" id="loginForm">
                <input type="text" placeholder="username" name="loginusername" id="loginusername" required>
                <input type="text" placeholder="password" name="loginpassword" id="loginpassword" required>
                <button type="submit" onclick="formSubmit(event, 'login')">login</button>
            </form>
        `
                    },
                    'register': {
                        'content': `
            <h1>register</h1>
            <form method="POST" action="php/register.php" id="registerForm">
                <input type="text" placeholder="username" name="username" id="username" required>
                <input type="text" placeholder="password" name="password" id="password" required>
                <button type="submit" onclick="formSubmit(event, 'register')">register</button>
            </form>
        `
                    }
                }
            } else if (logged===true) {
                pageInfo = {
                    'home': {
                        'content': `
            <section>
                <h1>you are logged in!</h1>
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
                console.log('ayaya');
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
        event.preventDefault();

        if (type === 'register') {
            setTimeout(function() {
                registerFormSubmission.submit();
            }, 2000);
        } else {
            setTimeout(function() {
                loginFormSubmission.submit();
            }, 2000);
        }
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
            pageInfo[page]['content'];
    } else {
        printPage('home');
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
