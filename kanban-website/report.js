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
    let rpt_devcrew1 = {};
    let rpt_devcrew2 = {};
    let rpt_devisdone = {};
    let rpt_assignees = {};
    let rpt_types={};
    let rpt_status={};
    let rpt_reporter={};
    let update = (rptdata, key, summary)=>{
        if(!rptdata[key]) rptdata[key] = { totalpoints: 0, count:0}
        rptdata[key].totalpoints += summary.storypoint;
        rptdata[key].count++;
    }
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
        let devisdone = summary.devIsDone;
        let devisdoneTxt = devisdone?'完成':'未完成';
        let assignee_displayName = summary.assignee_displayName;
        let issueTypeName = summary.issueTypeName?summary.issueTypeName:'';
        //
        devisdone ? update(rpt_devcrew1, assignee_displayName+','+devisdoneTxt, summary)
                  : update(rpt_devcrew2, assignee_displayName+','+devisdoneTxt, summary)
        //
        update(rpt_devisdone, devisdoneTxt, summary)
        //
        update(rpt_assignees, assignee_displayName, summary)
        //
        update(rpt_types, issueTypeName, summary)
        //
        update(rpt_status, status, summary)
        //
        update(rpt_reporter, reporter_displayName, summary)

        totalpoints += summary.storypoint;
    }
    
    showSprintStoryReport('按【完成】统计', totalpoints, rpt_devcrew1)
    showSprintStoryReport('按【未完成】统计', totalpoints, rpt_devcrew2)
    showSprintStoryReport('按dev完成统计', totalpoints, rpt_devisdone)
    showSprintStoryReport('按上线状态统计', totalpoints, rpt_status)
    showSprintStoryReport('按负责人统计', totalpoints, rpt_assignees)
    showSprintStoryReport('按故事类型统计', totalpoints, rpt_types)
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
    let rid = 'id'+(Math.random()+'').replace(/\./g, '');
    let pid = 'p'+rid;
    let cid = 'c'+rid;
    let html = `<tr><td colspan="999" style="background-color:#0000ff21;">
                    <span style="float:left;">"${desc}"，共(<span class="type_number">${totalpoints}</span>点)</span>
                    <br>
                    <span style="float:left;">完成数：<div id="${cid}" class="ct-chart ${cid}" style="height:110px;width:110px;"></div></span>
                    <span style="float:left;">点数：<div id="${pid}" class="ct-chart ${pid}" style="height:110px;width:110px;"></div></span>
                    </td>
                </tr>`;
    let totalcount = 0;
    for(let name in rpt_assignees){
        totalcount += rpt_assignees[name].count;
    }
    let chart_labels = [];
    let chartarr_p = [];
    let chartarr_c = [];
    for(let name in rpt_assignees){
        let p = rpt_assignees[name].totalpoints;
        let c = rpt_assignees[name].count;

        chart_labels.push(name)
        chartarr_p.push(p);
        chartarr_c.push(c);
        html += `<tr>
                    <td class="rpt_item_name" align="right">${name}</td>
                    <td class="type_number" align="right">${c}个</td>
                    <td align="right">${_percentage(c, totalcount)}%</td>
                    <td class="type_number" align="right">${p}点</td>
                    <td align="right">${_percentage(p,totalpoints)}%</td>
                </tr>`;
    }
    $('#summary_list_body').append(html);
    //chart
    new Chartist.Bar(`.${pid}`, {
        labels:chart_labels,
        series: [
            chartarr_p
        ]
      });
    new Chartist.Bar(`.${cid}`, {
        labels:chart_labels,
        series: [
            chartarr_c
        ]
    });
}