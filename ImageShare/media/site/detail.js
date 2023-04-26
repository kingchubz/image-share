$.get( "../../images/1/", function( data ) {
  $("document").ready(()=>{
    const image_field = $("#image_field")[0];
    image_field.innerHTML = `<img src="${data.image}" style="max-width:100%;height:auto;"/>`

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
				<img class="d-flex" src="${comment_set[i].owner.picture}">
				${comment_set[i].owner.username}
			</div>
			<div class="d-inline-flex p-2 mr-2">
				<p>${comment_set[i].text}</p>
			</div>
		</div>`;
    }

    if(document.cookie.includes("token")){
        $("#auth").attr('style', 'display: none !important');
    } else {
        $("#profile").attr('style', 'display: none !important');
    }

    });
});



