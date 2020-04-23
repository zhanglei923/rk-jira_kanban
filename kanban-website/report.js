let resetSummaryTable = ()=>{
    $('#summary_list').html(`
        <table border="1" style="border: 1px solid gray;"> 
            <thead>
                <tr>
                    <th></th>
                    <th>个数</th>
                    <th>%</th>
                    <th>点数</th>
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
    let rpt_stretchorcommit={};
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
        //
        update(rpt_stretchorcommit, summary.stretchorcommited_displayName, summary)
        

        totalpoints += summary.storypoint;
    }
    
    showSprintStoryReport('按负责人统计', totalpoints, rpt_assignees)
    showSprintStoryReport('按负责人【完成】统计', totalpoints, rpt_devcrew1)
    showSprintStoryReport('按负责人【未完成】统计', totalpoints, rpt_devcrew2)
    showSprintStoryReport('按团队完成统计', totalpoints, rpt_devisdone)
    showSprintStoryReport('按上线状态统计', totalpoints, rpt_status)
    showSprintStoryReport('按故事类型统计', totalpoints, rpt_types)
    showSprintStoryReport('按提需求方统计', totalpoints, rpt_reporter)
    showSprintStoryReport('按提s/c统计', totalpoints, rpt_stretchorcommit)
    
}
let showSprintStoryReport = (desc, totalpoints, rpt_assignees)=>{
    let rid = 'id'+(Math.random()+'').replace(/\./g, '');
    let pid = 'p'+rid;
    let cid = 'c'+rid;
    let showchart = true;
    let html = `<tr><td colspan="999" style="background-color:#0000ff21;">${desc}</td></tr>`;
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
    html += `<tr><td colspan="999">
                    <span style="float:left;">"${desc}"，共(<span class="type_number">${totalpoints}</span>点)</span>
                    
                    ${showchart?`<br>
                    <span style="float:left;"><b>个数</b><div id="${cid}" class="ct-chart ${cid}" style="height:110px;width:310px;"></div></span>
                    <span style="float:left;"><b>点数</b><div id="${pid}" class="ct-chart ${pid}" style="height:110px;width:310px;"></div></span>`
                    :``}
                    </td>
                </tr>`;
    $('#summary_list_body').append(html);
    //chart
    if(showchart){
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
}