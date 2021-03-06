let reportWholeTeamInfo = (records)=>{
    $('#teamperformance_list').html('');//reset
    let report_point = {};
    let report_num = {};
    let totalpoints = 0;
    let totalpoints_done = 0;
    let totalpoints_notdone = 0;
    let totalnum = 0;
    let totalnum_done = 0;
    let totalnum_notdone = 0;

    for(let i=0;i<records.length;i++){
        let record = records[i];
        if(record.notExist) continue;
        let summary = record.summary;
        let assignee = summary.assignee?summary.assignee:'';

        if(!report_point[summary.stretchorcommited])report_point[summary.stretchorcommited] = {
            total: 0,
            done: 0,
            notdone: 0
        };
        if(!report_num[summary.stretchorcommited])report_num[summary.stretchorcommited] = {
            total: 0,
            done: 0,
            notdone: 0
        };
        if(summary.devIsDone){
            report_point[summary.stretchorcommited].done += summary.storypoint;
            totalpoints_done += summary.storypoint;
            report_num[summary.stretchorcommited].done++;
            totalnum_done++;
        }else{
            report_point[summary.stretchorcommited].notdone += summary.storypoint;
            totalpoints_notdone += summary.storypoint;
            report_num[summary.stretchorcommited].notdone++;
            totalnum_notdone++;
        }
        report_point[summary.stretchorcommited].total += summary.storypoint;
        report_num[summary.stretchorcommited].total ++;
        totalpoints += summary.storypoint;
        totalnum++;
    }
    let rpttxt = ``;

    if(report_num && report_num.commited && report_num.stretched)
    rpttxt += `
    <div class="iscount_rpt">
        全部个数：${totalnum} = <span class="number_done">${totalnum_done}</span> + <span class="number_open">${totalnum_notdone}</span>，完成率${_percentage(totalnum_done, totalnum)}%<br>
        &emsp;commited个数，占比(${_percentage(report_num.commited.total, totalnum)}%)：${report_num.commited.total} = <span class="number_done">${report_num.commited.done}</span> + <span class="number_open">${report_num.commited.notdone}</span>，
        commited完成率${_percentage(report_num.commited.done, report_num.commited.total)}%
        ，commited完成占总数的${report_num.commited.done}/${totalnum}=${_percentage(report_num.commited.done, totalnum)}%
        ，commited未完成占总数的${report_num.commited.notdone}/${totalnum}=${_percentage(report_num.commited.notdone, totalnum)}%
        <br>
        &emsp;stretched个数，占比(${_percentage(report_num.stretched.total, totalnum)}%)：${report_num.stretched.total} = <span class="number_done">${report_num.stretched.done}</span> + <span class="number_open">${report_num.stretched.notdone}</span>，
        stretched完成率${_percentage(report_num.stretched.done, report_num.stretched.total)}%
        ，stretched完成占总数的${report_num.stretched.done}/${totalnum}=${_percentage(report_num.stretched.done, totalnum)}%
        ，stretched未完成占总数的${report_num.stretched.notdone}/${totalnum}=${_percentage(report_num.stretched.notdone, totalnum)}%
        <br>
    </div>`

    rpttxt += `<hr>`

    if(report_point && report_point.commited && report_point.stretched)
    rpttxt += `
    <div class="ispoint_rpt">
        全部点数：${totalpoints} = <span class="number_done">${totalpoints_done}</span> + <span class="number_open">${totalpoints_notdone}</span>，完成率${_percentage(totalpoints_done, totalpoints)}%<br>
        &emsp;commited点数，占比(${_percentage(report_point.commited.total, totalpoints)}%)：${report_point.commited.total} = <span class="number_done">${report_point.commited.done}</span> + <span class="number_open">${report_point.commited.notdone}</span>，
        commited完成率${_percentage(report_point.commited.done, report_point.commited.total)}%
        ，commited完成占总数的${report_point.commited.done}/${totalpoints}=${_percentage(report_point.commited.done, totalpoints)}%
        ，commited未完成占总数的${report_point.commited.notdone}/${totalpoints}=${_percentage(report_point.commited.notdone, totalpoints)}%
        <br>
        &emsp;stretched点数，占比(${_percentage(report_point.stretched.total, totalpoints)}%)：${report_point.stretched.total} = <span class="number_done">${report_point.stretched.done}</span> + <span class="number_open">${report_point.stretched.notdone}</span>，
        stretched点完成率${_percentage(report_point.stretched.done, report_point.stretched.total)}%
        ，stretched完成占总点数的${report_point.stretched.done}/${totalpoints}=${_percentage(report_point.stretched.done, totalpoints)}%
        ，stretched未完成占总点数的${report_point.stretched.notdone}/${totalpoints}=${_percentage(report_point.stretched.notdone, totalpoints)}%
        <br>
    </div>`
    
    console.log(report_point)
    $('#teamperformance_list').html(rpttxt)

}