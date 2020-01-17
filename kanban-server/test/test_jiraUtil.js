let fs = require('fs')
let pathutil = require('path')
let jiraUtil = require('../jiraUtil');

let jiraId = 'PLATFORM-26965'
jiraUtil.findIssue(jiraId, function(issue) {
    console.log('Status: ' + issue.fields.status.name);
    console.log('summary: ' + issue.fields.summary);
    console.log('assignee: ' + issue.fields.assignee.name);
    console.log('reporter: ' + issue.fields.reporter.name);
    
    //fs.writeFileSync(`./debug/${jiraId}.json`, JSON.stringify(issue))

  }, function(err) {
    console.error(err);
  })