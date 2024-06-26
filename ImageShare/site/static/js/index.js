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

function next_page() {
    if(window.location.search.includes('page=')) {
        var current_page = window.location.search.split('page=')[1];
        var next_page = parseInt(current_page) + 1;
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + next_page);
        } else {
            window.location.assign('./index?page=' + next_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=2');
        else
            window.location.assign('./index?page=2');
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
            window.location.assign('./index?page=' + prev_page);
        }
    }
}

function set_page(target_page) {
    if(window.location.search.includes('page=')) {
        if(window.location.search.includes('search=')) {
            url = window.location.href.split('&')[0];
            window.location.assign(url + '&page=' + target_page);
        } else {
            window.location.assign('./index?page=' + target_page);
        }
    } else {
        if(window.location.search.includes('search='))
            window.location.assign(window.location.href + '&page=' + target_page);
        else
            window.location.assign('./index?page=' + target_page);
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
    } else {
        $("#auth").attr('style', 'display: none !important');
        $.ajax("./api/profile/",{ headers: auth_header,success: function( data ) {
            $("#profile_image").attr('src', `${data.picture}`);
        }});
    }

    if(window.location.search.includes('search=')) {
        var search = window.location.search.split('search=')[1];
        search = search.split('&')[0];
        $('#filter').text('tag: ' + search);
    } else {
        $('#filter').hide();
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


    $.get(`./api/images/${window.location.search}`, function( response ) {
        const image_field = $("#image_field")[0];

        for(let i=0; i<response.results.length; i++){
            image_field.innerHTML += `<div class="p-2"><a href="./detail?id=${response.results[i].id}"><img src="${response.results[i].image}" style="max-width:200px;max-height:150px;"></a></div>`
        }

        const tag_field = $("#tag_list")[0];
        const all_tag_set = new Set()

        for(let i=0; i<response.results.length; i++){
            let tag_set = response.results[i].tag_set
            for(let i=0; i<tag_set.length; i++){
                if(!all_tag_set.has(tag_set[i].name)){
                    all_tag_set.add(tag_set[i].name)
                    tag_field.innerHTML += `<li><a href="./index?search=${tag_set[i].name}">${tag_set[i].name}</a></li>`
                }
            }
        }
    });


    //search
    var suggestions = [];
    $.ajax("./api/tags/",{ headers: auth_header,success: function( data ) {
        const tag_field = $("#tag_field")[0];
        for(let i=0; i<data.count; i++){
            suggestions.push(`${data.results[i].name}`);
        }
    }});

    $("#resultBox").hide()
    $("#search").on("input", ()=>{
        let userData = $("#search").val();
        let tagArray = [];
        if(userData){
            tagArray = suggestions.filter((e)=>{
                return e.toLowerCase().startsWith(userData.toLowerCase());
            });
            tagArray = tagArray.map((e)=>{
                return `<a href="./index?search=${e}" style="color: inherit; text-decoration: inherit;">${e}</a><br>`;
            });

            showSuggestions(tagArray);
            $("#resultBox").show();
        }else{
            $("#resultBox").hide()
        }
    });

    function showSuggestions(list){
         $("#resultBox")[0].innerHTML = ''
        list.forEach((e)=>{
             $("#resultBox")[0].innerHTML += e;
        });
    }
});