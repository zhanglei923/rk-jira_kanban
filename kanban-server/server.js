var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var URL = require('url');
var bodyParser = require('body-parser')
var _ = require('lodash')
var pathutil = require('path');

let jiraUtil = require('./jiraUtil')

let PORT = 3007;
var httpServer = http.createServer(app);

var allowCrossDomain = function(req, res, next) {
    console.log('from:', req.headers.origin  )
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

let webPath1 = pathutil.resolve(__dirname, '../kanban-website')
let webPath2 = pathutil.resolve(__dirname, '../kanban-www')
//全局拦截器
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache')
    next();
});
// http://localhost:3007/kanban-website/
// http://localhost:3007/kanban-www/build/index.html
app.use('/kanban-website', express.static(webPath1));//注意：必须在全局拦截器之后，否则拦截器无法运行
app.use('/kanban-www', express.static(webPath2));//注意：必须在全局拦截器之后，否则拦截器无法运行

app.get('/action/jira-info',function(req, res){
    res.send(jiraUtil.getJiraInfo())
});
// http://localhost:3007/action/jira/search?query_string=filter=19917
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

// http://localhost:3007/action/jira/search?query_string=filter=19917
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

// http://localhost:3007/action/jira/test?query_string=filter=19917
app.get('/action/jira/test',function(req, res){
    var url = req.url;
    var urlInfo = URL.parse(url, true);
    //console.log(urlInfo)
    var query_string = urlInfo.query.query_string;
    query_string = decodeURIComponent(query_string);
    res.send(query_string)
})

//启动
var server = app.listen(3007, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });