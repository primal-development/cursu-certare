
let client_id = null;
let client_secret = null;
const auth_link = "https://www.strava.com/oauth/token";

// detecting if the user already connected strava to the app
// it is done by checking if there are any existing cookies
if (document.cookie != ''){
    console.log("You previously connected strava");

    let cleaned_cookies = [];   // where the cookie values will be in second position of the array eg.:  refresh_token = cleaned_cookies[1][1];
    let cookies = decodeURIComponent(document.cookie).split(';');   // get cookies and put them in an array

    // split up the cookies array into 
    // [0 (first cookie)][0] --> cookie name
    // [0 (first cookie)][1] --> cookie value
    cookies.forEach(cookie => {
        cleaned_cookies.push(cookie.split('='));
    })

    // getting the values from cookie array (at position 1 the value is located, at position 0 the name is located)
    refresh_token = cleaned_cookies[1][1];
    client_id = cleaned_cookies[2][1];
    client_secret = cleaned_cookies[3][1];

    // get new acces token by making a post request with the refresh token
    reAuthorize();

}else{
    console.log("First login to strava");

    // get API key like client_id and client_secret that are securely located on a .env file on the server
    getAPI_KEY().then((res) => {
        client_id = res.client_id;
        client_secret = res.client_secret;
        // begin authentification process
        auth();
    });
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// functions

// get API key like client_id and client_secret that are securely located on a .env file on the server
async function getAPI_KEY() {
    const response = await fetch('https://stravatest.ddns.net/api' , {
        method: 'get',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });
    const keys = await response.json();

    return keys
}

async function submitUserCredentials(url, data) {
    // Default options are marked with *
    console.log("Submitting user credentials");
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    console.log(response.json()); // parses JSON response into native JavaScript objects
    return response.json();
  }


//begin authentification process
function auth(){

    // getting the authentication token from the address bar
    auth_token = location.search;
    auth_token = cleanupAuthToken(auth_token);

    let access_token = null;
    let refresh_token = null;
    let athlete_id = null;
    let first_name = null;
    let last_name = null;

    // getting the access and refresh token by making a post request with the authentification code
    getTokens(auth_token).then(function (res) {
        access_token = res.access_token;
        refresh_token = res.refresh_token;
        athlete_id = res.athlete.id;
        first_name = res.athlete.firstname;
        last_name = res.athlete.lastname;

        console.log("AthleteID: " +  athlete_id);

        let data = {
            athlete_id: athlete_id,
            refresh_token: refresh_token,
            first_name: first_name,
            last_name: last_name
        };
        submitUserCredentials('https://stravatest.ddns.net/key', data);

        // get the activities of the authenticated athlete
        getActivities(res);

    });
}

// extract the AuthToken out of the search bar content
function cleanupAuthToken(str) {
    return str.split("&")[1].slice(5);
}

// get the activities of the authenticated athlete
async function getActivities(res) {

    document.cookie = "access_token=" +  res.access_token + ";"
    document.cookie = "refresh_token=" +  res.refresh_token + ";"
    document.cookie = "client_id=" + client_id + ";"
    document.cookie = "client_secret=" + client_secret + ";"

    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`

    // get the activities
    fetch(activities_link)
    .then((res) => res.json())
    .then((json) => {
        console.log(json);

        // write them into the document
        str = ""
        for (let i = 0; i < json.length; i++) {
            str += json[i].name + "     " + json[i].distance/1000 + "km\n";
        }
           
        document.getElementById("activities").innerText = str;
        
    });

}

// getting the access and refresh token by making a post request with the authentification code
async function getTokens(auth_token) {
    const response = await fetch(auth_link, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            client_id: client_id,
            client_secret: client_secret,
            code: auth_token,
            grant_type: 'authorization_code'
        })
    })

    return response.json();
}

// get new acces token by making a post request with the refresh token
function reAuthorize() {

    fetch(auth_link, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        })
    }).then(res => res.json())
        .then(res => getActivities(res))
}