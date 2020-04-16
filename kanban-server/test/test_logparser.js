let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
let jiraUtil = require('../jiraUtil');

let dir = pathutil.parse(__filename).dir;

let logcontent = fs.readFileSync(pathutil.resolve(dir, './log.txt'), 'utf8')

let crew_name_list = [
    'zl','cz','lhd','sxf','why'
];

let _parseCrewLogs = (crew_name)=>{
    let crew_blocks = logcontent.split(`>>>${crew_name}>>>`);
    
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
    console.log(crew_log_lines)
    
    fs.writeFileSync(pathutil.resolve(dir, `./log_${crew_name}.txt`), crew_log_lines.join('\n'));
    
}

crew_name_list.forEach((crew_name)=>{
    _parseCrewLogs(crew_name)
});