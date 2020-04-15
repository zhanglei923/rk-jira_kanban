var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var URL = require('url');
var bodyParser = require('body-parser')
var _ = require('lodash')
var pathutil = require('path');

let jiraUtil = require('./jiraUtil')

let PORT = 3006;
var httpServer = http.createServer(app);

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

let webPath = pathutil.resolve(__dirname, '../kanban-website')
//全局拦截器
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache')
    next();
});
app.use('/', express.static(webPath));//注意：必须在全局拦截器之后，否则拦截器无法运行

app.get('/action/jira-info',function(req, res){
    res.send(jiraUtil.getJiraInfo())
});
// http://localhost:3006/action/jira/search?query_string=filter=19917
app.get('/action/jira/find-issues',function(req, res){
    var url = req.url;
    var urlInfo = URL.parse(url, true);
    //console.log(urlInfo)
    var issueIdList = urlInfo.query.id_list;
    issueIdList = _.trim(issueIdList);
    if(!issueIdList) {
        res.send({})
        return;
    }
    let idList = issueIdList.split(',');
    jiraUtil.findIssues(idList, (records)=>{
        res.send(records)
    })
})

// http://localhost:3006/action/jira/search?query_string=filter=19917
app.get('/action/jira/search',function(req, res){
    var url = req.url;
    var urlInfo = URL.parse(url, true);
    //console.log(urlInfo)
    var query_string = urlInfo.query.query_string;
    query_string = decodeURIComponent(query_string);
    jiraUtil.searchJira(query_string, (records)=>{
        res.send(records)
    })
})

//启动
var server = app.listen(3006, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });