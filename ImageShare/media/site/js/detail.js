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

var image_id;
function make_comment(){
    $("#image_id").attr('value', `${image_id}`);

    $.ajax(`./api/comments/`,{
    method: 'POST',
    headers: auth_header,
    dataType: 'json',
    data: $("#comment_form").serialize(),
    success: function(){
        location.reload();
    }});
}

$("document").ready(()=>{
    if(expired){
        $("#profile").attr('style', 'display: none !important');
    } else {
        $("#auth").attr('style', 'display: none !important');
        $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
            $("#profile_pic").attr('src', `${data.picture}`);
            $("#profile_image").attr('src', `${data.picture}`);
            $("#username").text(data.username)
        }});
    }

    params = window.location.search
    param_id = params.split('?id=')[1]
    param_id = parseInt(param_id)

    $.get( `./api/images/${param_id}/`, function( data ) {

        const image_field = $("#image_field")[0];
        image_field.innerHTML = `<img src="${data.image}" style="max-width:100%;height:auto;"/>`

        image_id = data.id

        const tag_field = $("#tag_list")[0];
        const tag_set = data.tag_set;

        for(let i=0; i<tag_set.length; i++){
            tag_field.innerHTML += `<li><a href="${tag_set[i].url}">${tag_set[i].name}</a></li>`
        }

        const comment_field = $("#comment_field")[0];
        const comment_set = data.comment_set;

        for(let i=0; i<comment_set.length; i++){
            comment_field.innerHTML +=
            `<div class="d-inline-flex p-2 mb-2 position-relative" style="background-color: gray;">
                <div class="position-absolute top-0 end-0">
                    <a href="#" role="button" data-bs-toggle="dropdown">
                        <img class="d-flex p-2" src="./three-dots-vertical.svg">
                    </a>
                    <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Report</a></li>
                    </ul>
                </div>
                <div class="d-flex flex-column justify-content-center p-2 text-center" style="border-right: 1px solid white; width:100px">
                    <img class="d-flex" src="${comment_set[i].owner.picture ? comment_set[i].owner.picture : './logo.ico'}">
                    ${comment_set[i].owner.username}
                </div>
                <div class="d-inline-flex p-2 mr-2">
                    <p>${comment_set[i].text}</p>
                </div>
            </div>`;
    }});
});



