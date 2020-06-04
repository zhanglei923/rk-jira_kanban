let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let mkdir = require('make-dir');
let jiraUtil = require('../../jiraUtil');

let jira_reg = /[A-Z]{1,}\-[0-9]{1,}/g

let parse = (logcontent)=>{
    let all_logs = [];
    let crew_name_list = getCrews(logcontent);
    console.log(crew_name_list);
    crew_name_list.forEach((crew_name)=>{
        let log = _parseCrewLogs(crew_name, logcontent);
        all_logs = all_logs.concat(log);
    });
    return all_logs.join('\n');
}
let getCrews = (logcontent)=>{
    let crews = []
    let rawcrews = logcontent.match(/\>{3}[a-z0-9]{1,}\>{3}/g);
    //console.log('crews', rawcrews);
    for(let i=0;i<rawcrews.length;i++){
        crews.push(_.trim(rawcrews[i].replace(/\>/g, '')));
    }
    crews = _.uniq(crews);
    console.log(crews);
    return crews;
}
let _parseCrewLogs = (crew_name, logcontent)=>{
    let crew_marker = `>>>${crew_name}>>>`;
    let crew_blocks = logcontent.split(crew_marker);
    
    console.log(crew_blocks.length)
    
    crew_blocks.pop();//去掉最后一项
    let crew_log_lines = [];
    crew_blocks.forEach((content)=>{
        //let arr2 = content.split(/\>{3}[a-zA-Z0-9]{1,}\>{3}/g);
        let lastIdx = content.lastIndexOf('>>>')
        let crew_content = content.substring(lastIdx)
        let crew_content_lines = crew_content.split('\n');
        let crew_content_lines2 = [];
        let isStarted = true;
        //console.log(crew_content_lines)
        crew_content_lines.forEach((line,i)=>{
            line = _.trim(line);
            //if(line)console.log(line)
            if(line)
            if(line === '>>>'){
                //console.log(line)
                //console.log('Missing1:', line)
            }else if(line.match(/^\-{1,}$/) || line.match(/^\-{3,}/)){
                isStarted=false;
                //console.log('Missing2:', line)
            }else if(isStarted){
                if(line.match(jira_reg)){
                    let idList = line.match(jira_reg)
                    if(idList){
                        idList.sort();
                        idList.forEach((jira_id)=>{
                            line = `http://jira.i${'ngageap'}p.com/browse/${jira_id}, ` + line;
                        })
                    }
                }
                crew_content_lines2.push(line);
            }else{
                console.log('Missing:', line)
            }
        })
        crew_content_lines2 = _.concat(crew_content_lines2);
        crew_content_lines2 = _.uniq(crew_content_lines2);
    
        crew_log_lines = crew_log_lines.concat(crew_content_lines2)
        console.log(crew_content_lines2)
    })
    crew_log_lines = _.concat(crew_log_lines)
    crew_log_lines = _.uniq(crew_log_lines)

    //将带bug号的记录，提取到前面
    let jiras = [];
    let notjiras =  [];
    let first = crew_log_lines.shift();//人名
    crew_log_lines.forEach((line)=>{
        line = '  '+line;
        if(line.match(jira_reg)){
            jiras.push(line);
        }else{
            notjiras.push(line);
        }
    })
    jiras.sort();//.reverse();
    notjiras.sort();//.reverse();
    crew_log_lines = [first];
    crew_log_lines = crew_log_lines.concat(jiras).concat(notjiras)


    crew_log_lines.unshift(crew_marker+'BEGIN')
    crew_log_lines.push(crew_marker+'END')
    console.log(crew_log_lines)
    
    return crew_log_lines;
}


module.exports = {
    parse
}