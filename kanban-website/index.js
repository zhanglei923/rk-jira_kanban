$(()=>{
    $('#parseBtn').on('click', ()=>{
        let content = $('#content').val();
        let idList = content.match(/[A-Z]{1,}\-[0-9]{1,}/g)
        console.log(idList)

        $.ajax({
            url: `/action/find-issues`,
            cache: false,
            data: {
                id_list: idList.join(',')
            },
            success: function( response ) {
              console.log(response)
            },
            error:function(ajaxObj,msg,err){
            }
        });
    })
})