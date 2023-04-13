$.get( "../../images/", function( data ) {
  $("document").ready(()=>{
    const image_field = $("#image_field")[0];
    for(let i=0; i<data.count; i++){
        image_field.innerHTML += `<div class="p-2"><a href="${data.results[i].url}"><img src="${data.results[i].image}" style="max-width:200px;max-height:150px;"></a></div>`
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



