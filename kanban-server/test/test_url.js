const getUrls = require('get-urls');

let urls = getUrls(`"UI 
↵
↵[http://10.10.0.136/prd/202007/UI/app%20launcher%20UI/]
↵
↵prd
↵
↵[http://10.10.0.136/prd/202007/AppLauncher]"`)

let urllist = []
for (var url of urls) { // 遍历Set
    url = url.replace(/\[/g, '').replace(/\]/g, '')
    urllist.push(url);
}
console.log(urllist);
//console.log(JSON.stringify(urls));