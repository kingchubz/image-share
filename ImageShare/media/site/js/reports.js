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
            window.location.assign('./reports?page=' + next_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=2');
        else
            window.location.assign('./reports?page=2');
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
            window.location.assign('./reports?page=' + prev_page);
        }
    }
}

function set_page(target_page) {
    if(window.location.search.includes('page=')) {
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + target_page);
        } else {
            window.location.assign('./reports?page=' + target_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=' + target_page);
        else
            window.location.assign('./reports?page=' + target_page);
    }
}

$(document).keyup(function(event) {
    if ($("#search").is(":focus") && event.key == "Enter") {
        var prompt = $("#search").text();
        prompt = $("#search").val();
        window.location.replace(`./index?search=${prompt}`);
    }
});

$("document").ready(()=>{
    if(expired){
        $("#profile").attr('style', 'display: none !important');
        window.location.replace("./index");
    } else {
        $("#auth").attr('style', 'display: none !important');
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

    $.get( `./api/reports/${window.location.search}`, function( data ) {
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