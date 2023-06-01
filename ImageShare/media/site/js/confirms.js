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

function delete_image(id){
    $.ajax(`./api/image_activate/${id}/`,{method: 'DELETE',headers: auth_header,success: function(){
        location.reload();
    }});
}

function confirm_image(id){
    $.ajax(`./api/image_activate/${id}/`,{method: 'PATCH',headers: auth_header,success: function(){
        location.reload();
    }});
}

//Getting images from server and displaying them

$("document").ready(()=>{
    if(expired){
        $("#profile").attr('style', 'display: none !important');
        window.location.replace("./index");
    } else {
        $("#auth").attr('style', 'display: none !important');
        $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
            $("#profile_image").attr('src', `${data.picture}`);
        }});
    }

    $.ajax("./api/image_activate/",{ headers: auth_header,success: function( data ) {
        const image_field = $("#image_field")[0];
        for(let i=0; i<data.count; i++){
            image_field.innerHTML += `
            <div class="position-relative m-2 text-center">
                <a href="${data.results[i].image}"><img src="${data.results[i].image}" style="width:200px;height:150px;"></a>
                <div class="position-absolute bottom-0 start-50 translate-middle-x w-100">
                    <div class="row">
                        <a class="text-reset col" onclick="confirm_image(${data.results[i].id})"><div style="background-color: green;">Confirm</div></a>
                        <a class="text-reset col" onclick="delete_image(${data.results[i].id})"><div style="background-color: red;">Deny</div></a>
                    </div>
                </div>
            </div>`
        }
    }});
});



