let fs = require('fs');
let pathutil = require('path');
let mkdir = require('make-dir');
let logparser = require('./logparser');

let dir = pathutil.parse(__filename).dir;
let rptDir = pathutil.resolve(dir, './rpt');
mkdir.sync(rptDir);


let logcontent = fs.readFileSync(pathutil.resolve(rptDir, './log.txt'), 'utf8')
let rpt = logparser.parse(logcontent);


console.log(rpt);
fs.writeFileSync(pathutil.resolve(rptDir, `./log_${'all'}.txt`), rpt);

