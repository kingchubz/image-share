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

function next_page() {
    if(window.location.search.includes('page=')) {
        var current_page = window.location.search.split('page=')[1];
        var next_page = parseInt(current_page) + 1;
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + next_page);
        } else {
            window.location.assign('./confirms?page=' + next_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=2');
        else
            window.location.assign('./confirms?page=2');
    }
}

function prev_page() {
    if(window.location.search.includes('page=')) {
        var current_page = window.location.search.split('page=')[1];
        var prev_page = parseInt(current_page) - 1;
        if(prev_page <= 0)
            return;
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + prev_page);
        } else {
            window.location.assign('./confirms?page=' + prev_page);
        }
    }
}

function set_page(target_page) {
    if(window.location.search.includes('page=')) {
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + target_page);
        } else {
            window.location.assign('./confirms?page=' + target_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=' + target_page);
        else
            window.location.assign('./confirms?page=' + target_page);
    }
}

$(document).keyup(function(event) {
    if ($("#search").is(":focus") && event.key == "Enter") {
        var prompt = $("#search").text();
        prompt = $("#search").val();
        window.location.replace(`./index?search=${prompt}`);
    }
});

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

    if(window.location.search.includes('page=')) {
        var current_page = parseInt(window.location.search.split('page=')[1]);
        if(current_page > 1) {
            $(".page-num").each((index, element) => {
                $(element).attr('onclick',`set_page(${current_page+index-1})`);
                $(element).text(current_page+index-1);
            });
        }
    }

    $.ajax(`./api/image_activate/${window.location.search}`,{ headers: auth_header,success: function( data ) {
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



