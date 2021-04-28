windows=document.getElementById('windows');
macos=document.getElementById('macos');
linux=document.getElementById('linux');
other=document.getElementById('other');

const form = document.getElementById('vote-form');
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const choice=document.querySelector('input[name=os]:checked').value;
    const selectedData={os:choice}

    fetch('http://localhost:3000/poll',{
        method: 'POST',
        body: JSON.stringify(selectedData),
        headers: new Headers({'Content-Type': 'application/json'})
    })
        .then((res)=>res.json())
        .then((data)=>console.log(data))
        .catch((err)=>console.error(err));
        
});

var eventSource =new EventSource("/poll/eventSource");
        

   
    fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then((data)=>{
        // var ctx = document.getElementById('myChart').getContext('2d');
        const votes=data.votes
        console.log(votes)
        const totalVotes=votes.length;
    
    //count the vote points for each os reduce-acc/current parameters

    voteCounts = votes.reduce((acc,vote)=>{
        acc[vote.os]=(acc[vote.os] || 0)+parseInt(vote.points);
        return acc;
    },
        {Windows:0,MacOS:0,Linux:0,Other:0}
    );

        
            const chart = new Highcharts.Chart({
                credits: { enabled: false },
                chart: {
                    renderTo: 'container',
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {
                    text: 'OS Polls'
                },
                subtitle: {
                    text: `Total Votes ${totalVotes}`
                },
                tooltip: {
                    
                },
                xAxis: {
                    categories: ['Windows', 'MacOs', 'Linux', 'Others'],
                    title: {
                        text: 'Primary axis'
                    }
                },
                yAxis:{
                    title: {
                        text: 'Secondary axis'
                    }
                },
                plotOptions: {
                    column: {
                        depth: 25,
                        colorByPoint: true
                    }
                },
                series: [{
                    showInLegend: false,
                    data: [voteCounts.Windows,voteCounts.MacOS,voteCounts.Linux,voteCounts.Other]
                }]
                
            });
            function showValues() {
                document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
                document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
                document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
            }
            
            // Activate the sliders
            document.querySelectorAll('#sliders input').forEach(input => input.addEventListener('input', e => {
                chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
                showValues();
                chart.redraw(false);
            }));
            
            showValues();
            eventSource.addEventListener("message",(e)=>{
                const jsondata=JSON.parse(e.data);
                console.log(jsondata.os);
                console.log( chart.xAxis[0].series[0].data[0].options.y)
                console.log( chart.series[0].data[1])
                if(jsondata.os==='Windows'){
                    const data=chart.series[0].yData[0]+=1
                    chart.series[0].data[0].update({y:data});
                }if(jsondata.os==='MacOS'){
                    const data2=chart.series[0].yData[1]+=1;
                    chart.series[0].data[1].update({y:data2});
                    
                }if(jsondata.os==='Linux'){
                    const data3=chart.series[0].yData[2]+=1;
                    chart.series[0].data[2].update({y:data3});
                    
                }if(jsondata.os==='Other'){
                    const data4=chart.series[0].yData[3]+=1;
                    chart.series[0].data[3].update({y:data4});
                    
                }
            });
        // }
    
    
    


})
