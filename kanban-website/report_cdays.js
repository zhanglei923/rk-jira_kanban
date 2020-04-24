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

    let labels = [];
    let chartdata = [];
    for(let i=min;i<max;i++){
        if(i%2===0){
            labels.push(i);
        }else{
            labels.push('')
        }
        if(typeof valmap[i+''] !== 'undefined'){
            chartdata.push(valmap[i+'']);
        }else{
            chartdata.push(0);
        }
    }
    chartdata = chartdata.reverse()
    labels.reverse()
    console.log(chartdata)

    new Chartist.Line('.created_day_chart', {
        labels,
        series: [
            chartdata
            //[12, 9, 7, 8, 5]
        ]
    }, {
        fullWidth: true,
        showPoint: false,
        distributeSeries: true,
        axisY: {
            // onlyInteger: true,
            // offset: 50
        },
        //height: '99%'
    });
}