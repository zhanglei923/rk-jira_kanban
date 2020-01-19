var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var URL = require('url');
var bodyParser = require('body-parser')
var _ = require('lodash')
var pathutil = require('path');

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
app.use('/website', express.static(webPath));//注意：必须在全局拦截器之后，否则拦截器无法运行

app.get('/action/projects',function(req, res){
    let query = req.query;

    res.send({})
})


//启动
var server = app.listen(3006, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });