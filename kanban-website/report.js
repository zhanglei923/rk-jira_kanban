let resetSummaryTable = ()=>{
    $('#summary_list').html(`
        <table border="1" style="border: 1px solid gray;"> 
            <thead>
                <tr>
                    <th></th>
                    <th>Count</th>
                    <th>%</th>
                    <th>Points</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody id="summary_list_body">
            </tbody>
        </table>`)
}
let generateSprintStoryReport = (records)=>{
    let totalpoints=0;
    let rpt_devisdone = {};
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
        let devisdone_displayName = summary.devIsDone;
        let assignee_displayName = summary.assignee_displayName;
        let issueTypeName = summary.issueTypeName?summary.issueTypeName:'';
        //
        if(!rpt_devisdone[devisdone_displayName]) rpt_devisdone[devisdone_displayName] = { totalpoints: 0, count:0}
        rpt_devisdone[devisdone_displayName].totalpoints += summary.storypoint;
        rpt_devisdone[devisdone_displayName].count++;
        //
        if(!rpt_assignees[assignee_displayName]) rpt_assignees[assignee_displayName] = { totalpoints: 0, count:0}
        rpt_assignees[assignee_displayName].totalpoints += summary.storypoint;
        rpt_assignees[assignee_displayName].count++;
        //
        if(!rpt_types[issueTypeName]) rpt_types[issueTypeName] = { totalpoints: 0, count:0}
        rpt_types[issueTypeName].totalpoints += summary.storypoint;
        rpt_types[issueTypeName].count++;
        //
        if(!rpt_status[status]) rpt_status[status] = {totalpoints: 0, count:0}
        rpt_status[status].totalpoints += summary.storypoint;
        rpt_status[status].count++;
        //
        if(!rpt_reporter[reporter_displayName]) rpt_reporter[reporter_displayName] = {totalpoints: 0, count:0}
        rpt_reporter[reporter_displayName].totalpoints += summary.storypoint;
        rpt_reporter[reporter_displayName].count++;

        totalpoints += summary.storypoint;
    }
    showSprintStoryReport('按dev完成统计', totalpoints, rpt_devisdone)
    showSprintStoryReport('按负责人统计', totalpoints, rpt_assignees)
    showSprintStoryReport('按故事类型统计', totalpoints, rpt_types)
    showSprintStoryReport('按状态统计', totalpoints, rpt_status)
    showSprintStoryReport('按提需求方统计', totalpoints, rpt_reporter)
}
let generateCommitedStretchedReport = (records)=>{
    let totalpoints=0;
    let commited_points = 0;
    let stretched_points = 0;
    let commited_count = 0;
    let stretched_count = 0;
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        if(record.notExist) continue;
        let summary = record.summary;
       // 
        if(summary.priorityId < 3){
            commited_points += summary.storypoint;
            commited_count++;
        }else{
            stretched_points += summary.storypoint;
            stretched_count++;
        }
        totalpoints += summary.storypoint;
    }
    let rpt = {
        'commited': {totalpoints: commited_points, count: commited_count},
        'stretched': {totalpoints: stretched_points, count: stretched_count}
    }
    showSprintStoryReport('按点数统计', totalpoints, rpt)
}
let _percentage = (a, b)=>{
    return ((a/b)*100).toFixed(1)
};
let showSprintStoryReport = (desc, totalpoints, rpt_assignees)=>{
    let html = `<tr><td colspan="999" style="background-color:#0000ff21;">
                    "${desc}"，共(<span class="type_number">${totalpoints}</span>)
                    </td>
                </tr>`;
    let totalcount = 0;
    for(let name in rpt_assignees){
        totalcount += rpt_assignees[name].count;
    }
    for(let name in rpt_assignees){
        let p = rpt_assignees[name].totalpoints;
        let c = rpt_assignees[name].count;
        html += `<tr>
                    <td class="rpt_item_name" align="right">${name}</td>
                    <td class="type_number" align="right">${c}</td>
                    <td align="right">${_percentage(c, totalcount)}%</td>
                    <td class="type_number" align="right">${p}</td>
                    <td align="right">${_percentage(p,totalpoints)}%</td>
                </tr>`;
    }
    $('#summary_list_body').append(html);
}