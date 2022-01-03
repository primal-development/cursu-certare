console.log("Test");

function validateForm() {
  if (document.forms["login-form"]["username"].value == 0){
    alert("username must be filled out");
    return false;
  }else if (document.forms["login-form"]["password"].value == 0){
    alert("password must be filled out");
    return false;
  }
}

function authorize(){

        
    document.cookie = "access_token=; Max-Age=-99999999;";
    document.cookie = "refresh_token=; Max-Age=-99999999;";
    document.cookie = "client_id=; Max-Age=-99999999;";
    document.cookie = "client_secret=; Max-Age=-99999999;";
    

    const redirectUrl = 'http://stravatest.ddns.net/redirect.html';
    let CLIENT_ID=67034;
    
    if (document.cookie != ''){

      console.log("You previously logged in to strava");
      console.log(document.cookie);
      window.location = redirectUrl;

    }else{
      window.location = `https://www.strava.com/oauth/authorize?client_id=67034&redirect_uri=${redirectUrl}&response_type=code&scope=activity:read_all`;
    }
}