let generateSprintStoryReport = (records)=>{
    let totalpoints=0;
    let rpt_assignees = {};
    let rpt_types={};
    let rpt_status={};
    let rpt_reporter={};
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        if(record.notExist) continue;
        let summary = record.summary;

        let status = summary.status;
        let reporter = summary.reporter;
        let reporter_displayName = summary.reporter_displayName;
        let statusname = status.toLowerCase().replace(/\s/g, '');
        let assignee = summary.assignee?summary.assignee:'';
        let assignee_displayName = summary.assignee_displayName;
        let issueTypeName = summary.issueTypeName?summary.issueTypeName:'';
        //
        if(!rpt_assignees[assignee_displayName]) rpt_assignees[assignee_displayName] = { totalpoints: 0}
        rpt_assignees[assignee_displayName].totalpoints += summary.storypoint;
        //
        if(!rpt_types[issueTypeName]) rpt_types[issueTypeName] = { totalpoints: 0}
        rpt_types[issueTypeName].totalpoints += summary.storypoint;
        //
        if(!rpt_status[status]) rpt_status[status] = {totalpoints: 0}
        rpt_status[status].totalpoints += summary.storypoint;
        //
        if(!rpt_reporter[reporter_displayName]) rpt_reporter[reporter_displayName] = {totalpoints: 0}
        rpt_reporter[reporter_displayName].totalpoints += summary.storypoint;

        totalpoints += summary.storypoint;
    }
    showSprintStoryReport('按负责人统计', totalpoints, rpt_assignees)
    showSprintStoryReport('按故事类型统计', totalpoints, rpt_types)
    showSprintStoryReport('按状态统计', totalpoints, rpt_status)
    showSprintStoryReport('按产品经理统计', totalpoints, rpt_reporter)
}
let showSprintStoryReport = (desc, totalpoints, rpt_assignees)=>{
    let html = `<div><div>${desc}Story Points:</div>`;
    for(let name in rpt_assignees){
        let p = rpt_assignees[name].totalpoints;
        html += `<div style="padding-left:20px;">${name}: ${p} (${((p/totalpoints)*100).toFixed(1)}%)</div>`
    }
    html += `</div>`
    $('#jira_list').append(html);
}