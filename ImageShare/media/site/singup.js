$("document").ready(()=>{






});

function register() {
    var email = $("input#email").val();
    var username = $("input#username").val();
    var password = $("input#password").val();
    var password_confirm = $("input#password_confirm").val();



    $.post( "../../register/",
    {"email": email,
    "username": username,
    "password": password,
    "password_confirm": password_confirm}).done(()=>{
                                            window.location.replace("./singin.html");
                                          });
}