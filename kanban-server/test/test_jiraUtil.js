let fs = require('fs')
let pathutil = require('path')
let jiraUtil = require('../jiraUtil');

let jiraId = 'DES-12509'
jiraUtil.findIssue(jiraId, function(id, summary, issue) {
    console.log('succ')
    // console.log('Status: ' + issue.fields.status.name);
    // console.log('summary: ' + issue.fields.summary);
    // console.log('assignee: ' + issue.fields.assignee.name);
    // console.log('reporter: ' + issue.fields.reporter.name);
    // console.log('created', issue.fields.created);
    // console.log('updated', issue.fields.updated);
    console.log('summary', summary)
    //fs.writeFileSync(`./debug/${jiraId}.json`, JSON.stringify(issue))

}, function(err) {
    console.error(err);
})