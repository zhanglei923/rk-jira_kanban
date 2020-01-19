let fs = require('fs')
let pathutil = require('path')
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
module.exports = {
    findIssue: (jiraId, succ, fail)=>{
        if(typeof succ === 'undefined') succ = ()=>{}
        if(typeof fail === 'undefined') fail = ()=>{}
        jira.findIssue(jiraId)
        .then(function(issue) {
            let summary = {
                status: issue.fields.status.name,
                summary: issue.fields.summary,
                assignee: issue.fields.assignee.name,
                reporter: issue.fields.reporter.name,
                created: issue.fields.created,
                updated: issue.fields.updated,
            };
            succ(issue, summary)
        })
        .catch(function(err) {
            fail(err);
        });
    }
}
