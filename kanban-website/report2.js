let reportCurrentDataInfo = (records)=>{
    $('#report_list').html('');//reset
    let records_onlyteam = [];
    let records_notteam = [];
    for(let i=0;i<records.length;i++){
        let record = records[i];
        if(record.notExist) continue;
        let summary = record.summary;
        let assignee = summary.assignee?summary.assignee:'';
        if(team_crews[assignee]) {
            records_onlyteam.push(record);
        }else{
            records_notteam.push(record);
        }
    }
    reportCurrentDataInfo_do('全部,'+records.length, records);
    reportCurrentDataInfo_do('团队内,'+records_onlyteam.length, records_onlyteam);
    reportCurrentDataInfo_do('团队外,'+records_notteam.length, records_notteam);

}
let reportCurrentDataInfo_do = (title, records)=>{
    let totalnum = 0;
    let people = {}
    let devisdone = 0;
    let htmlrows = '';
    for(let i=0;i<records.length;i++){
        let record = records[i];
        let id = record.id;
        if(record.notExist) continue;
        let summary = record.summary;
        let assignee = summary.assignee?summary.assignee:'';
        let assignee_displayName = summary.assignee_displayName;

        if(!people[assignee_displayName]){
            people[assignee_displayName] = {
                issue_total:0,
                issue_done:0
            }
        }
        people[assignee_displayName].issue_total++;

        let status = summary.status;
        let reporter = summary.reporter;
        
        totalnum++;
        if(summary.devIsDone) {
            people[assignee_displayName].issue_done++;
            devisdone++;
        }
        console.log(summary)
    }
    let peoplehtml = `<tr>
                        <td></td>
                        <td></td>
                    </tr>`;
    let chartid = 'chart'+(Math.random()+'').replace(/\./g, '');
    let charttitle = [];
    let chartdata = [[],[],[]]
    for(let name in people){
        charttitle.push(name);
        let pdata = people[name];
        let notdone = pdata.issue_total - pdata.issue_done;
        chartdata[0].push(pdata.issue_total)
        chartdata[1].push(notdone)
        chartdata[2].push(pdata.issue_done)
        peoplehtml += `<tr>
                            <td align="right"><span class="rpt_item_name">${name}</span></td>
                            <td class="type_number">
                                <span class="number_total">${pdata.issue_total}</span>=<span class="number_done">${pdata.issue_done}</span>+<span class="number_open">${notdone}</span>
                                &nbsp;[${_percentage(pdata.issue_done, pdata.issue_total)}%]
                                </td>
                        </tr>`
    }
    peoplehtml += `<tr><td colspan="99"><div class="${chartid}" style="width:600px;"></div></td></tr>`;
    let html = `
    <table border="1" style="border: 1px solid gray;"> 
        <thead>
            <tr>
                <th colspan="99" style="background-color:#0000ff21;">${title}</th>
            </tr>
        </thead>
        <tbody id="currentdata_body">
            <tr>
                <td colspan="99">完成+剩余=合计, ${devisdone}+${totalnum-devisdone}=${totalnum}, 完成率=${_percentage(devisdone, totalnum)}%</td>
            </tr>
            ${peoplehtml}
        </tbody>
    </table>`    
    $('#report_list').append(html);
    new Chartist.Bar(`.${chartid}`, {
        labels:charttitle,
        series: chartdata
    });
};