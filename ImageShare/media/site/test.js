$.get( "../../images/", function( data ) {
  $("document").ready(()=>{
    const e = $("#imagespace")[0];
    for(let i=0; i<data.count; i++)
        e.innerHTML += `<div class="p-2"><a href="127.0.0.1/images/${data.results[i].id}"><img src="${data.results[i].image}" style="width:200px;height:150px;"></a></div>`
    });
});



