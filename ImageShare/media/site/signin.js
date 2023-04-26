$("document").ready(()=>{
    if(document.cookie.includes("token")){
        window.location.replace("http://127.0.0.1:8000/media/site/index.html");
    } else {
        $("#profile").attr('style', 'display: none !important');
    }
});

function login() {
    var username = $("input#username").val();
    var password = $("input#password").val();

    $.ajax
    ({
      type: "POST",
      url: "../../login/",
      dataType: 'json',
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password)
      },
    }).done((data)=>{
        document.cookie = "token" +"=" + data.token + ";expires=" + data.expiry;
    });
}