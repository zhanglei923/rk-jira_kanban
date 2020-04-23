let reportCreatedDays = (createdDiffDaysFromNow)=>{
    createdDiffDaysFromNow = _.sortBy(createdDiffDaysFromNow);
    createdDiffDaysFromNow.reverse();
    let min = createdDiffDaysFromNow[createdDiffDaysFromNow.length-1];
    let max = createdDiffDaysFromNow[0];

    console.log('createdDiffDaysFromNow', createdDiffDaysFromNow)
    console.log('/', min,max)

    let valmap = {}
    createdDiffDaysFromNow.forEach((num)=>{
        if(!valmap[num+''])valmap[num+'']=0
        valmap[num+'']++;
    })
    console.log(valmap)

    let chartdata = [];
    for(let i=min;i<max;i++){
        if(valmap[i+'']){
            chartdata.push(valmap[i+'']);
        }else{
            chartdata.push(0);
        }
    }
    chartdata = chartdata.reverse()
    console.log(chartdata)

    new Chartist.Line('.created_day_chart', {
        //labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
            chartdata
            //[12, 9, 7, 8, 5]
        ]
    });
}