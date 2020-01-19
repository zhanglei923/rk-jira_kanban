let fs = require('fs')
let pathutil = require('path')
let jiraUtil = require('../jiraUtil');

let idList = ['PLATFORM-26965', 'PLATFORM-27688', 'DES-12509', 'xxx']
jiraUtil.findIssues(idList, function(records) {
  records.forEach((record)=>{
      if(record){
        console.log(record.id, record.summary)
      }else{
        console.log(record.id, 'not-found')
      }
  })
})