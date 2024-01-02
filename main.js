// ihawp

class dink {
    constructor() {
        this.currentPage = 'home';
        //var for all account info
    }


    // ajax request logic should go here, determine user info and then use it in the app
    ajaxRequestGET() {

    }

    // check if they are logged in
    // if they are logged in get their user_info
    // if not let them continue
    // this process would take over upon registration/login

    getUsername() {
        return 'ihawp';
    }

    pageInfo = {
        'home': {
            'function': 'home()',
            'content': ``
        },
        'profile': {
            'function': 'profile()',
            'content': ``
        },
    }
    loadPage(page) {
        document.body.innerHTML = `
            <h1>login</h1>
            <form method="POST" action="php/login.php" id="loginForm">
                <input type="text" placeholder="username" name="username" id="username" required>
                <input type="text" placeholder="password" name="password" id="password" required>
                <button type="submit" onclick="formSubmit(event, 'login')">login</button>
            </form>
            <br>
            <h1>register</h1>
            <form method="POST" action="php/register.php" id="registerForm">
                <input type="text" placeholder="username" name="username" id="username" required>
                <input type="text" placeholder="password" name="password" id="password" required>
                <button type="submit" onclick="formSubmit(event, 'register')">register</button>
            </form>
        `;
    }

}

function loadPage(page) {
    doit.loadPage(page);
}

// start app
const doit = new dink();
loadPage('home');

const registerFormSubmission = document.getElementById('registerForm');
const loginFormSubmission = document.getElementById('loginForm');
function formSubmit(event, type) {
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


