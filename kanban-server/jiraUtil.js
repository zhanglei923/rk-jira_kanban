let fs = require('fs')
let pathutil = require('path')
let _ = require('lodash')
var JiraApi = require('jira-client');

let configpath = pathutil.resolve(__dirname, '../.config')
let config = fs.readFileSync(configpath, 'utf-8')
//console.log(config)
config = JSON.parse(config)
console.log(config)

// Initialize
let jiraConfig = Object.assign(config, {
  protocol: 'http',
  apiVersion: '2',
  strictSSL: true
})
var jira = new JiraApi(jiraConfig);

let getJiraInfo = ()=>{
    return jiraConfig;
}
let findIssue = (jiraId, succ, fail)=>{
    if(typeof succ === 'undefined') succ = ()=>{}
    if(typeof fail === 'undefined') fail = ()=>{}
    jiraId = _.trim(jiraId);
    jira.findIssue(jiraId)
    .then(function(issue) {
        //fs.writeFileSync('a.json', JSON.stringify(issue.fields.updated))
        let summary = {}
        try{
            summary ={
                status: issue.fields.status.name,
                summary: issue.fields.summary,
                assignee: issue.fields.assignee ? issue.fields.assignee.name : null,
                reporter: issue.fields.reporter ? issue.fields.reporter.name : null,
                created: issue.fields.created,
                updated: issue.fields.updated
            };
        }catch(e){
            fail(jiraId, e)
        }
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
    findIssue,
    findIssues,
    getJiraInfo
}
