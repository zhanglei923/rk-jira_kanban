let fs = require('fs')
let pathutil = require('path')
let jiraUtil = require('../jiraUtil');

let jira = jiraUtil.getJiraInstance();
let queryString = `filter=19917  `
jira.searchJira(queryString).then((o)=>{
    console.log(o)
    fs.writeFileSync('result.json', JSON.stringify(o))
})