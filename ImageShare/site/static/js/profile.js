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
            window.location.assign('./profile?page=' + next_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=2');
        else
            window.location.assign('./profile?page=2');
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
            window.location.assign('./profile?page=' + prev_page);
        }
    }
}

function set_page(target_page) {
    if(window.location.search.includes('page=')) {
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + target_page);
        } else {
            window.location.assign('./profile?page=' + target_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=' + target_page);
        else
            window.location.assign('./profile?page=' + target_page);
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
    $.ajax(`./api/images/${id}/`,{method: 'DELETE',headers: auth_header,success: function(){
        location.reload();
    }});
}

function post_image(){
    let formData = new FormData();
    let desc = $('#description')[0];
    formData.append('description', desc.value);
    let tag_field = $('#tag_field').val();
    tag_id_list = tag_field.map((x)=>{return parseInt(x, 10)});
    for(let i=0; i<tag_id_list.length; i++)
        formData.append('tag_id_list', tag_id_list[i])
    formData.append('image', $('input[type=file]#image')[0].files[0]);

    request = $.ajax({
        type: 'POST',
        url: "./api/images/",
        headers: auth_header,
        data: formData,
        processData: false,
        contentType: false
    });

    request.done(()=>{
        location.reload();
    });

    request.fail((data)=>{
        $("#alert").show();
    });
}

function post_pfp(){
    let formData = new FormData();
    formData.append('picture', $('input[type=file]#pfp')[0].files[0]);

    request = $.ajax({
        type: 'PATCH',
        url: "./api/profile/",
        headers: auth_header,
        data: formData,
        processData: false,
        contentType: false
    });

    request.done(()=>{
        location.reload();
    });

    request.fail((data)=>{
        $("#alert").show();
    });
}

//Getting images from server and displaying them
$("document").ready(()=>{
    $("#alert").hide();

    if(expired){
        $("#profile").attr('style', 'display: none !important');
        window.location.replace("./index");
    } else {
        $("#auth").attr('style', 'display: none !important');
        $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
            $("#profile_pic").attr('src', `${data.picture}`);
            $("#profile_image").attr('src', `${data.picture}`);
            $("#username").text(data.username)
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

    $.ajax(`./api/user_image/${window.location.search}`,{ headers: auth_header,success: function( data ) {
        const image_field = $("#image_field")[0];
        for(let i=0; i<data.count; i++){
            image_field.innerHTML +=
                    `<div class="position-relative m-2 text-center">
                        <a href="./detail?id=${data.results[i].id}"><img src="${data.results[i].image}" style="max-width:200px;max-height:150px;"></a>
                        <button type="button" class="btn btn-outline-danger position-absolute bottom-0 start-50 translate-middle-x w-100" data-bs-toggle="modal" data-bs-target="#delete${i}">
                            Delete
                        </button>
                    </div>

                    <div class="modal fade" id="delete${i}" tabindex="-1">
                      <div class="modal-dialog">
                        <div class="modal-content bg-dark">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="delete${i}_lable">Delete Image</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <img src="${data.results[i].image}" style="max-width:200px;max-height:150px;">
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onclick="delete_image(${data.results[i].id})" class="btn btn-danger">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>`
        }
    }});

    $.ajax("./api/tags/",{ headers: auth_header,success: function( data ) {
        const tag_field = $("#tag_field")[0];
        for(let i=0; i<data.count; i++){
            tag_field.innerHTML += `<option value="${data.results[i].id}">${data.results[i].name}</option>`
        }
    }});
});



