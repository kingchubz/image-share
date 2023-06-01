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

$("document").ready(()=>{
    if(expired){
        $("#profile").attr('style', 'display: none !important');
        window.location.replace("./index");
    } else {
        $("#auth").attr('style', 'display: none !important');
    }

    $.get( "./api/reports/", function( data ) {
        const report_field = $("#report_field")[0];
        for(let i=0; i<data.count; i++){
            report_field.innerHTML +=
            `<div class="d-inline-flex p-2 mb-2 position-relative" style="background-color: gray;">
                <div class="d-flex flex-column justify-content-center p-2 text-center" style="border-right: 1px solid white; width:100px">
                    <img class="d-flex" src="${data.results[i].reportedUser.picture}">
                    ${data.results[i].reportedUser.username}
                </div>
                <div class="d-inline-flex p-2 mr-2 w-75">
                    <p>${data.results[i].text}</p>
                </div>
                <div>
                    <form>
                        <select class="form-select m-2" aria-label="Punishment">
                            <option selected>Punishment</option>
                            <option value="1">1 week</option>
                            <option value="2">1 month</option>
                            <option value="3">forever</option>
                        </select>
                        <button type="button" class="btn btn-primary m-2">Confirm</button>
                        <button type="button" class="btn btn-primary m-2">Deny</button>
                    </form>
                </div>
            </div>`
    }});

    $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
        $("#profile_image").attr('src', `${data.picture}`);
    }});
});