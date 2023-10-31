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

$(document).keyup(function(event) {
    if ($("#search").is(":focus") && event.key == "Enter") {
        var prompt = $("#search").text();
        prompt = $("#search").val();
        window.location.replace(`./index?search=${prompt}`);
    }
});

function login() {
    var username = $("input#username").val();
    var password = $("input#password").val();

    request = $.ajax({
      type: "POST",
      url: "./api/login/",
      dataType: 'json',
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password)
      },
    });

    request.done((data)=>{
        document.cookie = "secret" +"=" + data.token + " " + data.expiry;
        window.location.replace("./index");
    });

    request.fail((data)=>{
        $("#alert").show();
    });
}

$("document").ready(()=>{
    $("#alert").hide();

    if(expired){
        $("#profile").attr('style', 'display: none !important');
    } else {
        $("#auth").attr('style', 'display: none !important');
        $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
            $("#profile_image").attr('src', `${data.picture}`);
        }});
    }
});