let userFilter;
if(window.location.search){
    userFilter = window.location.search.split('filter=')[1]
    if(userFilter){
        userFilter = decodeURIComponent(userFilter);
    }
}
let jiraConfig = {};
let _percentage = (a, b)=>{
    if(b==0)return 0;
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
        $('#jira_list').html(`<b style="color:red;font-size:20px;">loading...</b>`);
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
              //更新jira的结果链接
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
        let idList = content.toUpperCase().match(/[A-Z]{1,}\-[0-9]{1,}/g)
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
              //更新jira的结果链接
              idList.forEach((id, i)=>{
                idList[i] = `id=${id}`;
              });
              idList = idList.join(' OR ');
              let searchurl = `http://jir${'a.ingage'}app.com/issues/?jql=${encodeURIComponent(idList)}`
              $('#jira_search_url').text(searchurl)
              $('#jira_search_url').attr('href', searchurl)
            },
            error:function(ajaxObj,msg,err){
            }
        });
    })
};
let initListEvents = ()=>{    
    $('#jira_list').on('mouseover', '.issueitem', (e)=>{
        //console.log('ho', e.currentTarget)
        $(e.currentTarget).addClass('hovering');
    });
    $('#jira_list').on('mouseout', '.issueitem', (e)=>{
        //console.log('ho', e.currentTarget)
        $(e.currentTarget).removeClass('hovering');
    });
}
$(()=>{
    initKeyInfo(()=>{
        init();
        initListEvents();
        initFilterCheckboxes();

        if(userFilter){
            $('#query_string').val(userFilter);
            $('#queryBtn').click();
        }
    })
})
let showIssues = (records)=>{
    let only_show_teammember = $('[type="checkbox"][name="checkbox-only_query_teammembers"]').prop('checked');
    $('.jira_report_table').off().remove();
    let html = `<table class="jira_report_table" border="0" cellspacing="0">`;
    records = _.sortBy(records, (o)=>{return o.summary.assignee})
    console.warn(records)
    let createdDiffDaysFromNow = [];
    let records2 = [];
    let countOfAssigneesBug = {}
    let countOfAssigneesStatus = {};
    let countOfStatus = {};
    let jira_urls = [];
    let count = 0;
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
        let detail = record.detail;
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
        if(only_show_teammember && !team_crews[assignee]) continue;
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
        if(diffDays <= 0)createdDiffDaysFromNow.push(Math.abs(diffDays))
        let jiraUrl = `http://${jiraConfig.host}/browse/${id}`;
        if(summary.devIsDone) statusname = 'devisdone';
        summary.descriptionUrlTxt = [];
        if(summary.descriptionUrl.length > 0){
            summary.descriptionUrl.forEach((url, i)=>{
                let a = `(<a target="_blank" class="url" href="${url}" title="${url}">url${i}</a>)`;
                summary.descriptionUrlTxt.push(a);
            })
        }
        count++;
        let sprintclass = summary.sprintname ? summary.sprintname.replace(/\s/g,'') : '';
        let li = `<tr id="${id}" class="jira_issue issueitem type_${id_prefix} status_${statusname} priority_${summary.priorityId}"
                        data-assignee="${summary.assignee?summary.assignee:''}"
                        data-reporter="${summary.reporter?summary.reporter:''}"
                    >
                    <td align="right" style="color:black;">#${count}</td>
                    <td class="reporter" align="right" style="color:#ccc !important;background-color:white !important;">${summary.reporter_displayName?summary.reporter_displayName:''}</td>
                    <td class="assignee" align="right" style="color:black !important;background-color:white !important;">${summary.assignee?summary.assignee_displayName:''}</td>
                    <td class="countOfAssigneesBug" align="right" style="color:black !important;background-color:white !important;">${countOfAssigneesBug[assignee]}</td>
                    <td class="sprinttask ${sprintclass}" title="${summary.sprintid}">${summary.sprintname?sprintclass:'-'}</td>
                    <td class="priorityName" title="${summary.priorityId}">${summary.priorityName?summary.priorityName:''}</td>
                    <td class="issueTypeName">${summary.issueTypeName?summary.issueTypeName:''}</td>
                    <td class="status" align="center" title="">${summary.devIsDone?'开发完成':''}</td>
                    <td class="status" align="right" title="">${summary.statusName}</td>
                    <td class="status" align="left" title="${summary.statusColor} / ${summary.statusName}">${summary.status}</td>
                    <td class="id"><a href="${jiraUrl}" target="_blank">${id}</a></td>
                    <td class="summary" title="${summary.description?summary.description:''}">
                        ${summary.summary}
                        <span style="float:right;">
                        ${summary.descriptionUrl.length > 0 ? ``+summary.descriptionUrlTxt.join('/') : ''}
                        ${summary.description?'<i style="color:gray;">desc</i>':''}
                        <div class="description">${summary.description?summary.description:''}</div>
                        </span>
                    </td>
                    <td class="created" style="display:none;">${momCreated.format('YYYY-MM-DD hh:mm')}</td>
                    <td class="diff" align="right" title="${momCreated.format('YYYY-MM-DD hh:mm')}">${diffDays}d</td>
                    <td class="point" align="right" title="storypoint">${summary.storypoint}点</td>
                    <td class="updated" style="display:none;">${moment(summary.updated).format('YYYY-MM-DD hh:mm')}</td>
                    <td class="updated">${showFixedVersions(detail.fields.fixVersions)}</td>
                    
                </tr>`
        html += li;

        records2.push(record);
    }
    html += `<tr><td colspan="999" style="max-width: 400px;">
               JIRA地址：<a id="jira_search_url" target="_blank" href="#">jira url</a>
            </td></tr>`;
    html += `</table>`;
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
    resetSummaryTable();
    reportCreatedDays(createdDiffDaysFromNow);
    reportCurrentDataInfo(records2);
    reportWholeTeamInfo(records2);
    generateSprintStoryReport(records2);
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
let showFixedVersions = (fixVersions)=>{
    if(!fixVersions) return '';
    let arr = [];
    fixVersions.forEach((version)=>{
        let a = `<a target="_blank" href="${version.self}">${version.name}</a>`;        
        if(0)a += `
        ${version.released?'released':'not-released'}
        ${version.archived?'archived':'not-archived'}
        `;
        arr.push(a);
    })
    return arr.join('')
     
    // archived: false
    // description: ""
    // id: "13009"
    // name: "v2007"
    // released: false
    // self: "http://jira.ingageapp.com/rest/api/2/version/13009"
    // return
}