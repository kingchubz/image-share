$("document").ready(()=>{






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