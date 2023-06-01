function get_auth_header(){
    if(!document.cookie.includes("secret"))
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
    } else {
        $("#auth").attr('style', 'display: none !important');
        $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
            $("#profile_image").attr('src', `${data.picture}`);
        }});
    }

    $.get( "./api/images/", function( data ) {
        const image_field = $("#image_field")[0];
        for(let i=0; i<data.count; i++){
            image_field.innerHTML += `<div class="p-2"><a href="./detail?id=${data.results[i].id}"><img src="${data.results[i].image}" style="max-width:200px;max-height:150px;"></a></div>`
        }

        const tag_field = $("#tag_list")[0];
        const all_tag_set = new Set()

        for(let i=0; i<data.count; i++){
            let tag_set = data.results[i].tag_set
            for(let i=0; i<tag_set.length; i++){
                if(!all_tag_set.has(tag_set[i].name)){
                    all_tag_set.add(tag_set[i].name)
                    tag_field.innerHTML += `<li><a href="${tag_set[i].url}">${tag_set[i].name}</a></li>`
                }
            }
        }
    });
});

