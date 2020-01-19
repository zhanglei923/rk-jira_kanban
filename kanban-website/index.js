let jiraConfig = {};
let initKeyInfo = (callback)=>{
    $.ajax({
        url: `/action/jira-info`,
        cache: false,
        success: function( response ) {
            jiraConfig = response;
            console.warn(jiraConfig)
            callback()
        },
        error:function(ajaxObj,msg,err){
        }
    });
}
let init = ()=>{
    $('#parseBtn').on('click', ()=>{
        let content = $('#content').val();
        content = _.trim(content);
        if(!content) return;
        let idList = content.match(/[A-Z]{1,}\-[0-9]{1,}/g)
        console.log(idList)
        idList.sort();
        $('#content_idlist').val(idList.join(', '))

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
};
$(()=>{
    initKeyInfo(()=>{
        init();
    })
})
let showIssues = (records)=>{
    let html = `<table class="jira_report_table" border="1" cellspacing="0">`;
    records = _.sortBy(records, (o)=>{return o.summary.assignee})
    console.warn(records)
    let countOfStatus = {};
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        let notExist = false;
        if(!record || !record.summary || !record.summary.status) {
            notExist = true;
            console.warn(id)
        }
        if(notExist){
            html += `<tr><td colspan="99" class="notexist">${id} Not Found</td></tr>`;
            continue;
        }
        let summary = record.summary;
        // status: issue.fields.status.name,
        // summary: issue.fields.summary,
        // assignee: issue.fields.assignee.name,
        // reporter: issue.fields.reporter.name,
        // created: issue.fields.created,
        // updated: issue.fields.updated,
        let id_prefix = id.split('-')[0].toLowerCase();
        let status = summary.status;
        let statusname = status.toLowerCase().replace(/\s/g, '');
        if(typeof countOfStatus[status] === 'undefined'){
            countOfStatus[status] = 1;
        }else{
            countOfStatus[status]++;
        }

        let momCreated = moment(summary.created);
        let diffDays = momCreated.diff(new Date(), 'days');
        let jiraUrl = `http://${jiraConfig.host}/browse/${id}`;
        let li = `<tr id="${id}" class="jira_issue issueitem type_${id_prefix} status_${statusname}">
                    <td class="assignee">${summary.assignee?summary.assignee:''}</td>
                    <td class="reporter">${summary.reporter?summary.reporter:''}</td>
                    <td class="status">${summary.status}</td>
                    <td class="id"><a href="${jiraUrl}" target="_blank">${id}</a></td>
                    <td class="summary">${summary.summary}</td>
                    <td class="created">${momCreated.format('YYYY-MM-DD hh:mm')}</td>
                    <td class="diff">${diffDays}d</td>
                    <td class="updated" style="display:none;">${moment(summary.updated).format('YYYY-MM-DD hh:mm')}</td>
                </tr>`
        html += li;
    }
    html += `</table>`
    console.warn(countOfStatus)
    $('#jira_list').html(html);
}