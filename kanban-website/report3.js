let reportWholeTeamInfo = (records)=>{
    $('#teamperformance_list').html('');//reset
    let report_point = {};
    let report_num = {};
    let totalpoints = 0;
    let totalnum = 0;
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
            report_num[summary.stretchorcommited].done++;
        }else{
            report_point[summary.stretchorcommited].notdone += summary.storypoint;
            report_num[summary.stretchorcommited].notdone++;
        }
        report_point[summary.stretchorcommited].total += summary.storypoint;
        report_num[summary.stretchorcommited].total ++;
        totalpoints += summary.storypoint;
        totalnum++;
    }
    let rpttxt = `
        全部点数：${totalpoints}点<br>
        全部commited点数：${report_point.commited.total}点，完成${report_point.commited.done}，未完成${report_point.commited.notdone}，完成率${_percentage(report_point.commited.done, report_point.commited.total)}%<br>
        全部stretched点数：${report_point.stretched.total}点，完成${report_point.stretched.done}，未完成${report_point.stretched.notdone}，完成率${_percentage(report_point.stretched.done, report_point.stretched.total)}%<br>
    `
    rpttxt += `<hr>`
    rpttxt += `
        全部个数：${totalnum}个<br>
        全部commited个数：${report_num.commited.total}个，完成${report_num.commited.done}，未完成${report_num.commited.notdone}，完成率${_percentage(report_num.commited.done, report_num.commited.total)}%<br>
        全部stretched个数：${report_num.stretched.total}个，完成${report_num.stretched.done}，未完成${report_num.stretched.notdone}，完成率${_percentage(report_num.stretched.done, report_num.stretched.total)}%<br>
    `
    console.log(report_point)
    $('#teamperformance_list').html(rpttxt)

}