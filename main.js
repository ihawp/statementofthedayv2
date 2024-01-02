// ihawp

class dink {
    constructor() {
        this.logged = undefined;
        this.currentPage = undefined;
        //var for all account info
        this.username = undefined;
        this.userID = undefined;
        this.pageInfo = {
            'home': {
                'content': `
            <h1>login</h1>

            <br>
            <h1>register</h1>
            <form method="POST" action="php/register.php" id="registerForm">
                <input type="text" placeholder="username" name="username" id="username" required>
                <input type="text" placeholder="password" name="password" id="password" required>
                <button type="submit" onclick="formSubmit(event, 'register')">register</button>
            </form>
        `
            },
            'profile': {
                'content': `
                
                `
            },
        }
    }

    loadPage(page) {
        // check if they are logged in
        let rUsern = '';
        let rUserid = 0;
        ajaxGET('php/checkLogged.php', function(error, response) {
            if (error) {
                console.error('Error:', error);
            } else {

                // THIS IS NOT ALLOWED
                // FOR SOME REASON!!!
                rUsern = response.namee;
                rUserid = response.idd;

            }
        });

        // THIS CAUSES THE USERNAME/ID
        // TO NOT BE SET BEFORE BEING
        // ADDED TO DOM
        this.username = rUsern;
        this.userID = rUserid;
        document.body.innerHTML = `${rUsern}, ${rUserid}` +
            this.pageInfo[page]['content'];
    }

    formSubmit(event, type) {
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

}

// start app
const doit = new dink();

let getCurrentPage = 'home';
doit.loadPage(getCurrentPage);

const registerFormSubmission = document.getElementById('registerForm');
const loginFormSubmission = document.getElementById('loginForm');

function ajaxGET(url, callback) {
    document.addEventListener('DOMContentLoaded', function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let response = JSON.parse(xhr.responseText);
                    callback(null, response);
                } else {
                    callback(xhr.statusText, null);
                }
            }
        };
        xhr.send();
    });
}