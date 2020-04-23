let jiraConfig = {};
let _percentage = (a, b)=>{
    let num = ((a/b)*100).toFixed(1)
    if(num*1===100) num=100;
    if(num*1===0) num=0;
    return num;
};
let team_crews = {
    [`ch${'engz'}he`]:{scrumTeam:'fe_global'},
    [`l${'iuh'}d`]:{scrumTeam:'flow'},
    [`s${'unx'}f`]:{scrumTeam:'fe_global'},
    [`w${'enh'}y`]:{scrumTeam:'flow'},
    [`zh${'angl'}ei`]:{scrumTeam:'fe_global'},
};
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
let getIds = (txt)=>{

}
let init = ()=>{
    $('#queryBtn').on('click', ()=>{
        let query_string = $('#query_string').val();
        query_string = _.trim(query_string);
        query_string = encodeURIComponent(query_string)
        $.ajax({
            url: `/action/jira/search`,
            cache: false,
            data: {
                query_string
            },
            success: function( response ) {
              showIssues(response)
              let searchurl = `http://jir${'a.ingage'}app.com/issues/?jql=${query_string}`
              $('#jira_search_url').text(searchurl)
              $('#jira_search_url').attr('href', searchurl)
            },
            error:function(ajaxObj,msg,err){
            }
        });
    });
    $('#parseBtn').on('click', ()=>{
        let content = $('#content').val();
        content = _.trim(content);
        let excontent = $('#exclude_content').val();
        excontent = _.trim(excontent);
        if(!content) return;
        let idList = content.match(/[A-Z]{1,}\-[0-9]{1,}/g)
        if(!idList){
            return;
        }
        console.log(idList)
        idList.sort();

        if(excontent){
            let exlist = excontent.match(/[A-Z]{1,}\-[0-9]{1,}/g);
            console.warn('exclude:', exlist)
            let exmap = {}
            exlist.forEach((ex)=>{exmap[ex]=true});
            idList.forEach((id, i)=>{
                if(exmap[id]) idList[i]=null;
            })
            idList = _.compact(idList)
        }

        $('#content_idlist').val(idList.join(', '))

        $.ajax({
            url: `/action/jira/find-issues`,
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
        initFilterCheckboxes();
    })
})
let showIssues = (records)=>{
    $('.jira_report_table').off().remove();
    let html = `<table class="jira_report_table" border="1" cellspacing="0">`;
    records = _.sortBy(records, (o)=>{return o.summary.assignee})
    console.warn(records)
    let countOfAssigneesBug = {}
    let countOfAssigneesStatus = {};
    let countOfStatus = {};
    let jira_urls = [];
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        let notExist = false;
        if(!record || !record.summary || !record.summary.status) {
            notExist = true;
            records[i].notExist = notExist;
            console.warn(id)
        }
        if(notExist){
            html += `<tr><td colspan="99" class="notexist">${id} Not Found</td></tr>`;
            continue;
        }
        jira_urls.push(`http://jira.in${'gage'}app.com/browse/${id}`)
        let summary = record.summary;
        // status: issue.fields.status.name,
        // summary: issue.fields.summary,
        // assignee: issue.fields.assignee.name,
        // reporter: issue.fields.reporter.name,
        // created: issue.fields.created,
        // updated: issue.fields.updated,
        let id_prefix = id.split('-')[0].toLowerCase();
        let status = summary.status;
        let statusName = summary.statusName;
        let statusname = status.toLowerCase().replace(/\s/g, '');
        let assignee = summary.assignee?summary.assignee:'';
        let assignee_displayName = summary.assignee_displayName;
        (typeof countOfStatus[status] === 'undefined')?countOfStatus[status] = 1: countOfStatus[status]++;
        (typeof countOfAssigneesBug[assignee] === 'undefined')?countOfAssigneesBug[assignee] = 1: countOfAssigneesBug[assignee]++;
        if(typeof countOfAssigneesStatus[status] === 'undefined') countOfAssigneesStatus[status]={}
        if(typeof countOfAssigneesStatus[status][assignee] === 'undefined') {
            countOfAssigneesStatus[status][assignee]=1;
        }else{
            countOfAssigneesStatus[status][assignee]++;
        }
        let momCreated = moment(summary.created);
        let diffDays = momCreated.diff(new Date(), 'days');
        let jiraUrl = `http://${jiraConfig.host}/browse/${id}`;
        if(summary.devIsDone) statusname = 'devisdone'
        let li = `<tr id="${id}" class="jira_issue issueitem type_${id_prefix} status_${statusname} priority_${summary.priorityId}"
                        data-assignee="${summary.assignee?summary.assignee:''}"
                        data-reporter="${summary.reporter?summary.reporter:''}"
                    >
                    <td class="reporter" align="right" style="color:#ccc !important;background-color:white !important;">${summary.reporter_displayName?summary.reporter_displayName:''}</td>
                    <td class="assignee" align="right" style="color:black !important;background-color:white !important;">${summary.assignee?summary.assignee_displayName:''}</td>
                    <td class="countOfAssigneesBug" style="color:black !important;background-color:white !important;">${countOfAssigneesBug[assignee]}</td>
                    <td class="priorityName" title="${summary.priorityId}">${summary.priorityName?summary.priorityName:''}</td>
                    <td class="issueTypeName">${summary.issueTypeName?summary.issueTypeName:''}</td>
                    <td class="status" align="center" title="">${summary.statusName}</td>
                    <td class="status" align="center" title="">${summary.devIsDone}</td>
                    <td class="status" align="center" title="${summary.statusColor} / ${summary.statusName}">${summary.status}</td>
                    <td class="id"><a href="${jiraUrl}" target="_blank">${id}</a></td>
                    <td class="summary">${summary.summary}</td>
                    <td class="created" style="display:none;">${momCreated.format('YYYY-MM-DD hh:mm')}</td>
                    <td class="diff" align="right" title="${momCreated.format('YYYY-MM-DD hh:mm')}">${diffDays}d</td>
                    <td class="point" align="right" title="storypoint">${summary.storypoint}</td>
                    <td class="updated" style="display:none;">${moment(summary.updated).format('YYYY-MM-DD hh:mm')}</td>
                </tr>`
        html += li;
    }

    html += `</table>`
    console.warn(countOfStatus)
    //console.warn(jira_urls.join('\n'))
    $('#jira_list').html(html);

    // let countsHtml = `<div>`
    // for(let key in countOfStatus){
    //     countsHtml += `${key}=<span class="type_number">${countOfStatus[key]}</span>, `
    // }
    // countsHtml += '<br>'+JSON.stringify(countOfAssigneesStatus) 
    // countsHtml += `</div>`
    // $('#report_list').html(countsHtml);
    resetSummaryTable()
    reportCurrentDataInfo(records);
    generateSprintStoryReport(records);
}
let initFilterCheckboxes = ()=>{
    $('body').on('click','[type="checkbox"][name="checkbox-filters"]', (e)=>{
        let str = ''
        $('[type="checkbox"][name="checkbox-filters"]').each((a, ckbx)=>{
            ckbx = $(ckbx)
            if($(ckbx).prop('checked')) str += ' OR ' + $(ckbx).val();
        })
        str = _.trim(str);
        str = str.replace(/^\s{0,}OR/g, '')
        str = _.trim(str);
        $('#query_string').val(str);
    })
}