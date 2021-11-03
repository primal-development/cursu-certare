
let client_id = null;
let client_secret = null;
const auth_link = "https://www.strava.com/oauth/token";

getAPI_KEY().then((res) => {
    console.log("Cleint secret: " + res.client_secret);
    client_id = res.client_id;
    client_secret = res.client_secret;

    auth();
});


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// functions

async function getAPI_KEY() {
    const response = await fetch('/api');
    const data = await response.json();

    return data
}

function auth(){

    // getting the authentication token from the address bar
    auth_token = location.search;
    auth_token = cleanupAuthToken(auth_token);
    console.log("Authentication Token: " + auth_token)

    let access_token = null;
    let refresh_token = null;

    getTokens(auth_token).then(function (res) {
        access_token = res.access_token;
        refresh_token = res.refresh_token;

        getActivities(res);

    });
}


function cleanupAuthToken(str) {
    return str.split("&")[1].slice(5);
}

async function getActivities(res) {

    console.log("Access token: " + res.access_token);

    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`

    
    fetch(activities_link)
    .then((res) => res.json())
    .then((json) => {
        console.log(json);
        str = ""
        for (let i = 0; i < json.length; i++) {
            str += json[i].name + "     " + json[i].distance/1000 + "km\n";
        }
           
        document.getElementById("activities").innerText = str;
        
    });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function getTokens(auth_token) {
    const response = await fetch(auth_link, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            client_id: '67034',
            client_secret: client_secret,
            code: auth_token,
            grant_type: 'authorization_code'
        })
    })

    return response.json();
}

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
            refresh_token: refresh_token,
            grant_type: 'refresh_token'
        })
    }).then(res => res.json())
        .then(res => getActivities(res))
}