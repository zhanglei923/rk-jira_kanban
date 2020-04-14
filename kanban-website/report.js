let generateSprintStoryReport = (records)=>{
    let rpt_assignees = {};
    let rpt_types={}
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        if(record.notExist) continue;
        let summary = record.summary;

        let status = summary.status;
        let statusname = status.toLowerCase().replace(/\s/g, '');
        let assignee = summary.assignee?summary.assignee:'';
        let issueTypeName = summary.issueTypeName?summary.issueTypeName:'';
        if(!rpt_assignees[assignee]) rpt_assignees[assignee] = {
            totalpoints: 0
        }
        if(!rpt_types[issueTypeName]) rpt_types[issueTypeName] = {
            totalpoints: 0
        }
        rpt_assignees[assignee].totalpoints += summary.storypoint;
        rpt_types[issueTypeName].totalpoints += summary.storypoint;
    }
    showSprintStoryReport(rpt_assignees)
    showSprintStoryReport(rpt_types)
}
let showSprintStoryReport = (rpt_assignees)=>{
    let html = `<div><div>Story Points:</div>`;
    for(let name in rpt_assignees){
        html += `<div style="padding-left:20px;">${name}: ${rpt_assignees[name].totalpoints}</div>`
    }
    html += `</div>`
    $('#jira_list').append(html);
}