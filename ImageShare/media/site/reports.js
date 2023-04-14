$.get( "../../reports/", function( data ) {
  $("document").ready(()=>{
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