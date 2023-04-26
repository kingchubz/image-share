$("document").ready(()=>{
    if(document.cookie.includes("token")){
        window.location.replace("http://127.0.0.1:8000/media/site/index.html");
    } else {
        $("#profile").attr('style', 'display: none !important');
    }
});

function register() {
    var username = $("input#username").val();
    var password = $("input#password").val();
    var password_confirm = $("input#password_confirm").val();



    $.post( "../../register/",
    {"username": username,
    "password": password,
    "password_confirm": password_confirm}).done(()=>{
                                            window.location.replace("./singin.html");
                                          });
}