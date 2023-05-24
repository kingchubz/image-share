function get_auth_header(c){
    c = "; " + c;
    var token = c.split("; token=");
    token = token.pop().split(";").shift();
    var auth_header = {"Authorization": "Token " + token};

    return auth_header;
}

var auth_header = get_auth_header(document.cookie)

function delete_image(id){
    $.ajax(`../../image_activate/${id}/`,{method: 'DELETE',headers: auth_header,success: function(){
        location.reload();
    }});
}

function confirm_image(id){
    $.ajax(`../../image_activate/${id}/`,{method: 'PATCH',headers: auth_header,success: function(){
        location.reload();
    }});
}

//Getting images from server and displaying them
$.ajax("../../image_activate/",{ headers: auth_header,success: function( data ) {
  $("document").ready(()=>{
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

    if(document.cookie.includes("token")){
        $("#auth").attr('style', 'display: none !important');
    } else {
        $("#profile").attr('style', 'display: none !important');
    }

    });
}});



