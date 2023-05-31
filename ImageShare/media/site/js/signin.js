function get_auth_header(){
    if(!document.cookie.includes('secret'))
        return ["" , true]

    cookie = document.cookie
    let array = cookie.split("secret=");
    array = array.pop().split(" ");

    let token = array.shift();
    let auth_header = {"Authorization": "Token " + token};

    let expire = new Date(array.shift())
    let expired = Date.now() > expire

    return [auth_header, expired];
}

var [auth_header, expired] = get_auth_header()

function logout() {
    $.ajax('./api/logout/',{
    method: 'POST',
    headers: auth_header,
    success: function(){
        document.cookie = "secret" +"=" + "none 2001-01-01T00:00:00.665101+03:00";
        window.location.replace("./index");
    }});
}

function login() {
    var username = $("input#username").val();
    var password = $("input#password").val();

    $.ajax
    ({
      type: "POST",
      url: "./api/login/",
      dataType: 'json',
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password)
      },
    }).done((data)=>{
        document.cookie = "secret" +"=" + data.token + " " + data.expiry;
        window.location.replace("./index");
    });
}

$("document").ready(()=>{
    if(expired){
        $("#profile").attr('style', 'display: none !important');
    } else {
        $("#auth").attr('style', 'display: none !important');
    }
});