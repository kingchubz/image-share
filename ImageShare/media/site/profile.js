function get_auth_header(c){
    c = "; " + c;
    var token = c.split("; token=");
    token = token.pop().split(";").shift();
    var auth_header = {"Authorization": "Token " + token};

    return auth_header;
}

var auth_header = get_auth_header(document.cookie)

function delete_image(id){
    $.ajax(`../../images/${id}/`,{method: 'DELETE',headers: auth_header,success: function(){
        location.reload();
    }});
}

function post_image(){
    var formData = new FormData();
    var desc = $('#description')[0];
    formData.append('description', desc.value);
    var tag_field = $('#tag_field').val();
    tag_id_list = tag_field.map((x)=>{return parseInt(x, 10)});
    for(let i=0; i<tag_id_list.length; i++)
        formData.append('tag_id_list', tag_id_list[i])
    formData.append('image', $('input[type=file]')[0].files[0]);

    $.ajax({
        type: 'POST',
        url: "../../images/",
        headers: auth_header,
        data: formData,
        processData: false,
        contentType: false,
        success: function(){
            location.reload();
        }
    });
}

//Getting images from server and displaying them
$("document").ready(()=>{
    $.ajax("../../user_image/",{ headers: auth_header,success: function( data ) {
        const image_field = $("#image_field")[0];
        for(let i=0; i<data.count; i++){
            image_field.innerHTML +=
                    `<div class="position-relative m-2 text-center">
                        <a href="${data.results[i].url}"><img src="${data.results[i].image}" style="max-width:200px;max-height:150px;"></a>
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

    $.ajax("../../tags/",{ headers: auth_header,success: function( data ) {
        const tag_field = $("#tag_field")[0];
        for(let i=0; i<data.count; i++){
            tag_field.innerHTML += `<option value="${data.results[i].id}">${data.results[i].name}</option>`
        }


    }});

    if(document.cookie.includes("token")){
        $("#auth").attr('style', 'display: none !important');
    } else {
        $("#profile").attr('style', 'display: none !important');
    }
});



