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

    loadPage() {

    }

}

const body = document.body;

function loadPage(page) {
    doit.loadPage(page);
}

function footer() {
    body.innerHTML += `
        <footer class="flex-center-column">
            <p>copyright something 2024!</p>
        </footer>
    `;
}
function home() {
    body.innerHTML = `
        <header>
            <div class="header-left">
            
            </div>
            <nav>
                <a onclick="login()">login</a>
                <a onclick="register()">register</a>
            </nav>
        </header>
        <br>
        <br>
        <br>
        <br>
        <br>
        <section class="blue">
            <h1>this is a section</h1>
            <h1>wow</h1>
            <p>i love you gracie</p>
        </section>
        <section>
            <h1>oh wow more i love you gracie</h1>
        </section>
    `;
}
function about() {

}
function contact() {

}
function login() {
    body.innerHTML = `
        <div class="form-section blue">
            <a onclick="home()" id="backButton"><--</a>
            <div class="border-background flex-center-column">
                <h1>Login</h1>
                <br>
                <form method="POST" action="">
       
                    <label for="username">Username:</label>
                    <input id="username" type="text" placeholder="username" name="username">
                   
                    <br>
                    <label for="password">Password:</label>
                    <input id="password" type="text" placeholder="password" name="password">
                    
                    <br>
                    <br>
                    <div class="flex-center-column">
                        <button type="submit" id="form-button-1">login</button>
                    </div>  
                    <p>Don't have an account yet? Register <a onclick="register()">here.</a></p>            
                </form>
            </div>
        </div>
    `;
}
function register() {
    body.innerHTML = `
        <div class="form-section blue">
            <form method="POST" action="">
                <input type="text" placeholder="username" name="username">
                <input type="text" placeholder="password" name="password">
            </form>
        </div>
    `;
}

// start app
const doit = new dink();
home();
footer();



