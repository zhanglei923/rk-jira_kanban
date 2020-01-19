let fs = require('fs')
let pathutil = require('path')
var JiraApi = require('jira-client');

let config = fs.readFileSync('../.config', 'utf-8')
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

let jiraId = 'PLATFORM-26231'
jira.findIssue(jiraId)
  .then(function(issue) {
    console.log('Status: ' + issue.fields.status.name);
    fs.writeFileSync(`./debug/${jiraId}.json`, JSON.stringify(issue))

  })
  .catch(function(err) {
    console.error(err);
  });

 jira.getAllBoards().then(function(issue) {
  console.log('Status: ' + issue);
  fs.writeFileSync(`./debug/getBoard.json`, JSON.stringify(issue))

})
jira.getAllSprints().then(function(issue) {
  console.log('Status: ' + issue);
  fs.writeFileSync(`./debug/Sprints.json`, JSON.stringify(issue))

})
jira.getAllVersions().then(function(issue) {
  console.log('Status: ' + issue);
  fs.writeFileSync(`./debug/Versions.json`, JSON.stringify(issue))

})
return;
jira.searchJira('issuetype in ("代码分支合并(已废弃）", 代码提交, Task, 协作问题, 国际化优化, 国际化资源, 安全风险, 实体适配, 实施发布申请, 技术任务, 技术改进, 技术调研, 技术需求, Improvement, Story) AND status in (open, "In Progress", Reopened) AND priority in (紧急, 重要, 中级) AND assignee in (liuhd, zhanglei, chengzhe) ORDER BY Rank ASC', 
{
    maxResults:100
}).then(function(list) {
    //console.log('Status: ' + issue.fields.status.name);
    fs.writeFileSync(`${'list'}.json`, JSON.stringify(list))
    list.issues.forEach((issue)=>{
        let fields = issue.fields;
        console.log(issue.key, fields.assignee.displayName, fields.summary, fields.priority.name)
    })
    console.log(list.total, list.issues.length)

});