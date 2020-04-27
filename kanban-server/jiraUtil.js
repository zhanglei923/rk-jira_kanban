let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
const getUrls = require('get-urls');
var JiraApi = require('jira-client');

let configpath = pathutil.resolve(__dirname, '../.config')
let config = fs.readFileSync(configpath, 'utf-8')
//console.log(config)
config = JSON.parse(config)
console.log(config)

const KEY_OF_SPRINTPOINT = 'customfield_10002';
const KEY_OF_SPRINT_Id = 'customfield_10004';

// Initialize
let jiraConfig = Object.assign(config, {
  protocol: 'http',
  apiVersion: '2',
  strictSSL: true
})
var jira = new JiraApi(jiraConfig);

let getJiraInstance = ()=>{
    return jira;
}
let getJiraInfo = ()=>{
    return jiraConfig;
}
let getSummary = (issue)=>{
    let summary = {}
    try{
        summary ={
            description:issue.fields.description,
            statusName: issue.fields.status.name,
            status: issue.fields.status.statusCategory.name,
            statusColor: issue.fields.status.statusCategory.colorName,
            summary: issue.fields.summary,
            assignee: issue.fields.assignee ? issue.fields.assignee.name : null,
            assignee_displayName: issue.fields.assignee ? issue.fields.assignee.displayName : null,
            reporter: issue.fields.reporter ? issue.fields.reporter.name : null,
            reporter_displayName: issue.fields.reporter ? issue.fields.reporter.displayName : null,                
            priorityId: issue.fields.priority ? issue.fields.priority.id : null,
            priorityName: issue.fields.priority ? issue.fields.priority.name : null,
            created: issue.fields.created,
            updated: issue.fields.updated,
            issueTypeName: issue.fields.issuetype.name,
            storypoint: issue.fields[KEY_OF_SPRINTPOINT]
        };
        let devIsDone = false;
        if(summary.statusName.toLowerCase().indexOf('sign-off')>=0) devIsDone = true;
        if(summary.status.toLowerCase().replace(/\s/g, '')==='done') devIsDone = true;
        summary.devIsDone = devIsDone;

        if(summary.priorityId < 3){
            summary.is_commited = true;
            summary.stretchorcommited = 'commited';
            summary.stretchorcommited_displayName = '必保任务(commited)';
        }else{
            summary.is_stretched = true;
            summary.stretchorcommited = 'stretched';
            summary.stretchorcommited_displayName = '可选任务(stretched)';
        }
        let sprintinfo = issue.fields[KEY_OF_SPRINT_Id];
        if(sprintinfo){
            sprintinfo = sprintinfo.join('')
            sprintinfo = sprintinfo.split(',');
            let sprintid;
            sprintinfo.forEach((item)=>{
                item = _.trim(item);
                if(item.match(/^name\=/)) sprintid = item.replace(/^name\=/, '');
            })
            summary.sprintid = sprintid;
            summary.sprintname = _.trim(sprintid.replace(/\d{1,}\.\d{1,}\-\d{1,}\.\d{1,}/g, ''));
        }else{
            summary.sprintid = false;
        }
        summary.descriptionUrl = [];
        if(summary.description){
            let urlset = getUrls(summary.description);
            for (var url of urlset) { // 遍历Set
                url = url.replace(/\[/g, '').replace(/\]/g, '')
                summary.descriptionUrl.push(url);
            }
        }
    }catch(e){
        //fail(jiraId, e)
        throw e;
    }
    return summary;
};
let searchJira = (queryString, succ, fail)=>{
    let results = [];
    jira.searchJira(queryString).then((o)=>{
        o.issues.forEach((issue, i)=>{
            let summary = getSummary(issue);
            //fs.writeFileSync(`./${issue.key}.json`, JSON.stringify(issue))
            results.push({
                id: issue.key,
                summary,
                detail: issue
            })
        })
        succ(results);
    })
};
let findIssue = (jiraId, succ, fail)=>{
    if(typeof succ === 'undefined') succ = ()=>{}
    if(typeof fail === 'undefined') fail = ()=>{}
    jiraId = _.trim(jiraId);
    jira.findIssue(jiraId)
    .then(function(issue) {
        //fs.writeFileSync('a.json', JSON.stringify(issue.fields.updated))
        let summary = getSummary(issue)
        //fs.writeFileSync('as.json', JSON.stringify(summary))
        succ(jiraId, summary, issue)
    })
    .catch(function(err) {
        fail(jiraId, err);
    });
}
let findIssues = (idList, callback)=>{
    let results = [];
    let count = 0;
    let final = ()=>{
        callback(results)
    }
    idList = _.uniq(idList);
    idList.forEach((id)=>{
        count++;
        findIssue(id, (jiraId, summary, detail)=>{
            results.push({
                id: jiraId,
                summary, 
                detail
            });
            //console.warn('>>>', jiraId)
            if(--count===0) final()
        }, (jiraId)=>{
            //console.warn('??', jiraId)
            results.push({
                id: jiraId,
                summary:{},
                detail:{}
            });
            if(--count===0) final()
        })
    });
}
module.exports = {
    searchJira,
    findIssue,
    findIssues,
    getJiraInstance,
    getJiraInfo
}
