let fs = require('fs')
let pathutil = require('path')
let jiraUtil = require('../jiraUtil');

let idList = ['PLATFORM-26965', 'PLATFORM-27688', 'DES-12509', 'xxx']
jiraUtil.findIssues(idList, function(records) {
  for(let id in records){
      let record = records[id];
      if(record){
        console.log(id, record.summary.summary)
      }else{
        console.log(id, 'not-found')
      }
  }
  //console.log(record)
})