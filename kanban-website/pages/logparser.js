let do_parse = ()=>{
    $.ajax({
        url: `/action/log/parse`,
        type: "POST",
        cache: false,
        data: {
            rawlog: $('#rawlog').val()
        },
        success: function( response ) {
           $('#parsedlog').val(response.rpt);
        },
        error:function(ajaxObj,msg,err){
        }
    });
}