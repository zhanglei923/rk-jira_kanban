$(()=>{
    $('#parseBtn').on('click', ()=>{
        let content = $('#content').val();
        content = _.trim(content);
        if(!content) return;
        let idList = content.match(/[A-Z]{1,}\-[0-9]{1,}/g)
        console.log(idList)

        $.ajax({
            url: `/action/find-issues`,
            cache: false,
            data: {
                id_list: idList.join(',')
            },
            success: function( response ) {
              showIssues(response)
            },
            error:function(ajaxObj,msg,err){
            }
        });
    })
})
let showIssues = (records)=>{
    let html = `<table>`;
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        let notExist = false;
        if(!record || !record.summary) {
            notExist = true;
            console.warn(id)
        }
        let summary = record.summary;
        // status: issue.fields.status.name,
        // summary: issue.fields.summary,
        // assignee: issue.fields.assignee.name,
        // reporter: issue.fields.reporter.name,
        // created: issue.fields.created,
        // updated: issue.fields.updated,
        let id_prefix = id.split('-')[0].toLowerCase();

        let li = `<tr id="${id}" class="jira_issue type_${id_prefix} ${summary.status}">
                    <td>${summary.status}</td>
                    <td>${id}</td>
                    <td>${summary.summary}</td>
                    <td>${summary.assignee}</td>
                    <td>${summary.reporter}</td>
                    <td>${moment(summary.created).format('YYYY-MM-DD hh:mm')}</td>
                    <td>${moment(summary.updated).format('YYYY-MM-DD hh:mm')}</td>
                </tr>`
        html += li;
    }
    html += `</table>`

    $('#jira_list').html(html);
}