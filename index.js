const out=document.getElementById("output");
const adddata = document.getElementById("add-data");
function start() {
    const selecte=document.getElementById("schedual-type");
    out.style.display="block";
    const arival=document.getElementById("a.t").value.trim();
    let arrivalarr=arival.split(",");
    const burst=document.getElementById("b.t").value.trim();
    let burstarr=burst.split(",");

    if(arrivalarr.length!==burstarr.length){
      alert("Yoops ! Invalid INPUT");
    }

    else if(selecte.value==="FCFS"){
        FCFS(arrivalarr,burstarr);
    }
    else if(selecte.value==="SJF"){
        SJF(arrivalarr,burstarr);
    }
    else if(selecte.value==="SRTF"){
        SRTF(arrivalarr,burstarr);
    }
    else if(selecte.value==="RR"){
        const quant=document.getElementById("q.t").value;
        RR(arrivalarr,burstarr,parseInt(quant));  
    }
    else if(selecte.value==="Priority"){
        const prio=document.getElementById("p.t").value.trim();
        let prioarr=prio.split(",");
        if(arrivalarr.length!==prioarr.length){
          alert("Yoops ! Invalid INPUT");
        }
        else{
          priority(arrivalarr,burstarr,prioarr);
        }
        
    }
    else if(selecte.value==="PP"){
        const prio=document.getElementById("p.p").value.trim();
        let prioarr=prio.split(",");
        if(arrivalarr.length!==prioarr.length){
          alert("Yoops ! Invalid INPUT");
        }
        else{
          preemptivepriority(arrivalarr,burstarr,prioarr);
        }
    }
}
function check() {
    const selecte = document.getElementById("schedual-type");
    const quantumField = document.getElementById('quant');
    const priorityField = document.getElementById('priority');
    const ppfield = document.getElementById('pp');

    if (selecte.value === "FCFS" || selecte.value === "SJF" || selecte.value === "SRTF") {
        quantumField.style.display = "none";
        priorityField.style.display = "none";
        ppfield.style.display="none";
    } else if (selecte.value === "RR") {
        
        quantumField.style.display = "block";
        priorityField.style.display = "none"; // Hide priority field
        ppfield.style.display="none";
    } else if (selecte.value === "Priority") {
        quantumField.style.display = "none"; // Hide quantum field
        priorityField.style.display = "block";
        ppfield.style.display="none";
    }
    else if(selecte.value==="PP"){
        quantumField.style.display = "none";
        priorityField.style.display = "none";
        ppfield.style.display="block";
    }
}
function FCFS(arrivalarr,burstarr) {
    let id=[];

    const n=arrivalarr.length;
    for(let i=0;i<n;i++){
        id[i]=i+1;
    }

    const combined=arrivalarr.map((value,index)=>[value,burstarr[index],id[index]]);
    combined.sort((a,b)=>{
        if(a[0]!==b[0]){
            return a[0]-b[0];
        }
    });
    arrivalarr=combined.map((tuple)=>tuple[0]);
    burstarr=combined.map((tuple)=>tuple[1]);
    id=combined.map((tuple)=>tuple[2]);
    

calc(arrivalarr,burstarr,id);
}
const SJF = (at, bt) => {
    const n = at.length;

    let id = [];
    let ct = []; // ct means complete time
    let ta = []; // ta means turn around time
    let wt = []; // wt means waiting time

    for (let i = 0; i < n; i++) {
        id[i] = i + 1;
    }

    let tot = 0;
    let totalwait = 0;
    let totaltat = 0;
    let st = 0;
    let f = new Array(n).fill(0);

    while (true) {
        let c = n;
        let min = 999;
        if (tot === n) break; // All processes completed

        for (let i = 0; i < n; i++) {
            if (parseInt(at[i]) <= st && f[i] === 0 && parseInt(bt[i]) < min) {
                min = parseInt(bt[i]);
                c = i;
            }
        }

        if (c === n) st++;
        else {
            ct[c] = st + parseInt(bt[c]);
            st += parseInt(bt[c]);
            ta[c] = ct[c] - parseInt(at[c]);
            wt[c] = ta[c] - parseInt(bt[c]);
            f[c] = 1;
            tot++;
        }
    }

    // Combine the arrays into a list of tuples
    const combined = id.map((_, i) => [id[i], at[i], bt[i], ct[i], ta[i], wt[i]]);

    // Sort the data based on the ct value (ascending order)
    const sortedData = combined.sort((a, b) => a[3] - b[3]);

    // Separate the sorted data back into individual arrays
    for (let i = 0; i < n; i++) {
        [id[i], at[i], bt[i], ct[i], ta[i], wt[i]] = sortedData[i];
    }

    for (let i = 0; i < n; i++) {
        totalwait += wt[i];
        totaltat += ta[i];
      }

      let currenttime=0;let ghantt=[];

      for(let i=0;i<at.length;i++){
        if(currenttime<parseInt(at[i])){
            currenttime=parseInt(at[i]);
            ghantt.push([currenttime,0]);
        }
        ghantt.push([ct[i],1]);
        currenttime=ct[i];
      }


    // Update the UI with average wait time and turnaround time
    adddata.innerHTML = `Avg. W.T : ${(totalwait / at.length).toFixed(2)} <br/> Avg. T.A.T : ${(totaltat / at.length).toFixed(2)}`;
    chartfcfs(ghantt,id);
    addtable(at,bt,ct,ta,wt,id)
};
function SRTF(at, bt) {
    let n = at.length;
    for(let i=0;i<n;i++){
        let x=parseInt(at[i]);
        let y=parseInt(bt[i]);
        bt[i]=y;
        at[i]=x;
    }
    let st = 0,
        tot = 0,
        avgwt = 0,
        avgta = 0;

    const pid = []; // Array to store process IDs
    const ct = [];
    const ta = [];
    const wt = [];
    const f = [];
    const k = [];
    const ghantt = [];
    const id = [];

    for (let i = 0; i < n; i++) {
        pid.push(i + 1); // Populating process IDs
        k.push(bt[i]); // Initializing k array with burst times
        f.push(0); // Initializing f array to keep track of process completion
    }

    while (true) {
        let min = Number.MAX_SAFE_INTEGER,
            c = n;
        if (tot === n) {
            break;
        }

        for (let i = 0; i < n; i++) {
            if(bt[i]===min && at[i]<at[c]){
                c=i;

            }
           else if (at[i] <= st && f[i] === 0 && bt[i] < min) {
                min = bt[i];
                c = i;
            }
        }

        if (c === n) {
            st++;
            ghantt.push([st, 0]);
            id.push(0);
        } else {
            bt[c]--;
            st++;
            ghantt.push([st, 1]);
            id.push(pid[c]);
            if (bt[c] === 0) {
                ct[c] = st;
                f[c] = 1;
                tot++;
            }
        }
    }

    for (let i = 0; i < n; i++) {
        ta[i] = ct[i] - at[i];
        wt[i] = ta[i] - k[i];
        avgwt += wt[i];
        avgta += ta[i];
    }
    // Printing average waiting time and average turnaround time
    adddata.innerHTML=`Avg. W.T : ${(avgwt/n).toFixed(2)} <br/> Avg. T.A.T : ${(avgta/n).toFixed(2)}`;
   
    addtable(at,k,ct,ta,wt,pid);
    reduceGhanttchart(ghantt,id);
}
function roundRobinScheduling(processes,quant) {
    let n = processes.length;
    let c = n; let ghantt=[],xid=[];
    let time = 0;
    let mini = Number.MAX_SAFE_INTEGER;
    let b = processes.map(p => p.BT);
    let a = processes.map(p => p.AT);
    let s = new Array(n).fill(null).map(() => new Array(20).fill(-1));
    let tot_wt = 0, tot_tat = 0;
    let flag = false;
  
    while (c !== 0) {
      mini = Number.MAX_SAFE_INTEGER;
      flag = false;
      let index = -1;
  
      for (let i = 0; i < n; i++) {
        let p = time + 0.1;
        if (a[i] <= p && mini > a[i] && b[i] > 0) {
          index = i;
          mini = a[i];
          flag = true;
        }
      }
  
      if (!flag) {
        time++;
        ghantt.push([time,0]);xid.push(0);
        continue;
      }
  
      let j = 0;
      while (s[index][j] !== -1) {
        j++;
      }
  
      if (s[index][j] === -1) {
        s[index][j] = time;
        processes[index].ST[j] = time;
      }
  
      if (b[index] <= quant) {
        time += b[index];
        ghantt.push([time,1]);xid.push(index+1);
        b[index] = 0;
      } else {
        time += quant;
        ghantt.push([time,1]);xid.push(index+1);
        b[index] -= quant;
      }
  
      if (b[index] > 0) {
        a[index] = time + 0.1;
      }
  
      if (b[index] === 0) {
        c--;
        processes[index].FT = time;
        processes[index].WT = processes[index].FT - processes[index].AT - processes[index].BT;
        tot_wt += processes[index].WT;
        processes[index].TAT = processes[index].BT + processes[index].WT;
        tot_tat += processes[index].TAT;
      }
    }

    let at=[],bt=[],ct=[],tat=[],wt=[],pid=[];
    for(let i=0;i<processes.length;i++){
        at.push(processes[i].AT);
        bt.push(processes[i].BT);
        ct.push(processes[i].FT);
        tat.push(ct[i]-at[i]);
        wt.push(processes[i].WT);
        pid.push(i+1);
    }
    // Calculating average wait time and turnaround time
    let avg_wt = tot_wt / n;
    let avg_tat = tot_tat / n;
    adddata.innerHTML = `Avg. W.T : ${(avg_wt).toFixed(2)} <br/> Avg. T.A.T : ${(avg_tat).toFixed(2)}`;
    addtable(at,bt,ct,tat,wt,pid);
    reduceGhanttchart(ghantt,xid);
  }
  
function RR(at,bt,quant){
    class Process {
        constructor(AT, BT, pos) {
          this.AT = AT;
          this.BT = BT;
          this.ST = new Array(20).fill(-1);
          this.WT = 0;
          this.FT = 0;
          this.TAT = 0;
          this.pos = pos;
        }
      }
    let processes=[];
    for(let i=0;i<at.length;i++){
            processes.push(new Process(parseInt(at[i]),parseInt(bt[i]),i+1));
    }
    roundRobinScheduling(processes,quant);
}
function priorityScheduling(processes) {
    // Sort processes by arrival time
    let ghantt=[];
    let xid=[];
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    let completedProcesses = [];
    let n=processes.length;
  
    while (processes.length > 0) {
      // Filter processes that have arrived by the current time
      let availableProcesses = processes.filter(p => p.arrivalTime <= currentTime);
  
      if (availableProcesses.length === 0) {
        // If no processes have arrived, move time forward
        
        currentTime = processes[0].arrivalTime;
        ghantt.push([currentTime,0]);
        continue;
      }
  
      // Sort available processes by priority and then by arrival time
      availableProcesses.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.arrivalTime - b.arrivalTime;
        }
        return a.priority - b.priority;
      });
  
      // Select the process with the highest priority
      let currentProcess = availableProcesses.shift();
      
      // Calculate waiting time and turn around time
      currentProcess.waitingTime = currentTime - currentProcess.arrivalTime;
      currentProcess.turnAroundTime = currentProcess.waitingTime + currentProcess.burstTime;
  
      // Update current time
      currentTime += currentProcess.burstTime;
      
  
      // Add to completed processes
      completedProcesses.push(currentProcess);
      ghantt.push([currentTime,1]);xid.push(currentProcess.id);
  
      // Remove the executed process from the main array
      processes = processes.filter(p => p.id !== currentProcess.id);
    }
    
    // Calculate average waiting time and turn around time
    let totalWaitingTime = completedProcesses.reduce((acc, p) => acc + p.waitingTime, 0);
    let totalTurnAroundTime = completedProcesses.reduce((acc, p) => acc + p.turnAroundTime, 0);
    let averageWaitingTime = (totalWaitingTime / completedProcesses.length).toFixed(2);
    let averageTurnAroundTime = (totalTurnAroundTime / completedProcesses.length).toFixed(2);
    // Log the results
    
    let at=[],bt=[],ct=[],tat=[],wt=[],pid=[];
    for(let i=0;i<n;i++){
        at[i]=(completedProcesses[i].arrivalTime);
        bt[i]=(completedProcesses[i].burstTime);
        tat[i]=(completedProcesses[i].turnAroundTime);
        wt[i]=(completedProcesses[i].waitingTime);
        ct[i]=(tat[i]+at[i]);
        pid[i]=(completedProcesses[i].id);
    }
    addtable(at,bt,ct,tat,wt,pid);
    chartfcfs(ghantt,xid);

    adddata.innerHTML=`Avg. W.T : ${averageWaitingTime} <br/> Avg. T.A.T : ${averageTurnAroundTime}`;
  }
function  priority(at,bt,p) {
    let processes=[];
    class Process {
        constructor(id, arrivalTime, burstTime, priority) {
          this.id = id;
          this.arrivalTime = arrivalTime;
          this.burstTime = burstTime;
          this.priority = priority;
          this.waitingTime = 0;
          this.turnAroundTime = 0;
        }
      }

      for(let i=0;i<at.length;i++){
        
        processes.push(new Process(i+1,parseInt(at[i]),parseInt(bt[i]),parseInt(p[i])));
      }
      priorityScheduling(processes);
}
function preemptivepriority(at,bt,pt){
    // Process constructor
function Process(id, arrivalTime, burstTime, priority) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.priority = priority;
    this.remainingTime = burstTime;
    this.completionTime = 0;
    this.turnaroundTime = 0; // Add turnaround time property
    this.waitingTime = 0; // Add waiting time property
  }
  
  // Function to execute the processes based on priority preemptive scheduling
  function priorityPreemptiveScheduling(processes) {
    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    let completedProcesses = 0;
    const n = processes.length;
    const executionSequence = [];

    let ghantt=[];let xid=[];
  
    // Execute processes until all are completed
    while (completedProcesses < n) {
      // Filter processes that have arrived and are not completed
      const availableProcesses = processes.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
  
      // Sort available processes by priority and remaining time
      availableProcesses.sort((a, b) => a.priority - b.priority || a.remainingTime - b.remainingTime);
  
      // If there are no available processes, increment time
      if (availableProcesses.length === 0) {
        currentTime++;
        ghantt.push([currentTime,0]);
        xid.push(0);
        continue;
      }
  
      // Select process with highest priority (lowest priority number)
      const currentProcess = availableProcesses[0];
  
      // Execute the current process
      currentProcess.remainingTime--;
      executionSequence.push(currentProcess.id);
      currentTime++;
      ghantt.push([currentTime,1]);
      xid.push(currentProcess.id);
  
      // If the process is completed, increment the count and record completion time
      if (currentProcess.remainingTime === 0) {
        completedProcesses++;
        currentProcess.completionTime = currentTime;
      }
    }
  
    // Calculate turnaround time and waiting time for each process
    let tot_tat=0,tot_wt=0;
    processes.forEach(process => {
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      tot_tat+= process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      tot_wt+=process.turnaroundTime - process.burstTime;
    });
    adddata.innerHTML=`Avg. W.T : ${(tot_wt/n).toFixed(2)} <br/> Avg. T.A.T : ${(tot_tat/n).toFixed(2)}`;
  
    // Print turnaround time and waiting time for each process
    let at2=[],bt2=[],ct=[],tat=[],wt=[],id=[];
    for (let i = 0; i < n; i++) {
      at2[i]=processes[i].arrivalTime;
      bt2[i]=processes[i].burstTime;
      ct[i]=processes[i].completionTime;
      tat[i]=processes[i].turnaroundTime;
      wt[i]=processes[i].waitingTime;
      id[i]=processes[i].id;
    }
    addtable(at2,bt2,ct,tat,wt,id);
    reduceGhanttchart(ghantt,xid);
  }
  
  let processes = [];
  for (let i = 0; i < at.length; i++) {
    processes.push(new Process(i + 1, parseInt(at[i]), parseInt(bt[i]), parseInt(pt[i])));
  }
  
  priorityPreemptiveScheduling(processes);

}
function reduceGhanttchart(ghanttchart, id) {
    const n=ghanttchart.length;
    const reducedGhanttchart = [];
    const pid = [];
    
    for (let i = 1; i < n; i++) {
        const [prevct,prevflag]=ghanttchart[i-1];
        
        if(id[i]!==id[i-1]){
            reducedGhanttchart.push([prevct,prevflag]);
            if(id[i-1]!==0){
            pid.push(id[i-1]);
            }
        }
    }
    reducedGhanttchart.push(ghanttchart[n-1]);
    pid.push(id[n-1]);

    chartfcfs(reducedGhanttchart,pid);
}
function calc(arrivalarr,burstarr,id) {
const adddata=document.getElementById("add-data");
let ghantt=[];
let completionarr=[];
let turnaroundarr=[];
let waitingarr=[];
let totalwait=0;let totaltat=0;

    let currenttime=0;
    for(let i=0;i<arrivalarr.length;i++){
        if(currenttime<parseInt(arrivalarr[i])){
            currenttime=parseInt(arrivalarr[i]);
            ghantt.push([currenttime,0]);
        }
        
        completionarr[i]=currenttime+parseInt(burstarr[i]);
        ghantt.push([completionarr[i],1]);
        turnaroundarr[i]=completionarr[i]-parseInt(arrivalarr[i]);
        waitingarr[i]=turnaroundarr[i]-parseInt(burstarr[i]);

        currenttime=completionarr[i];

        totalwait+=waitingarr[i];
        totaltat+=turnaroundarr[i];
    }
    addtable(arrivalarr,burstarr,completionarr,turnaroundarr,waitingarr,id);
    adddata.innerHTML=`Avg. W.T : ${(totalwait/arrivalarr.length).toFixed(2)} <br/> Avg. T.A.T : ${(totaltat/arrivalarr.length).toFixed(2)}`;

    chartfcfs(ghantt,id);
}
function chartfcfs(ghantt,id) {
    const boxes=document.getElementById("right-foot");
    boxes.innerHTML="";
    boxes.innerHTML+=`<div class="ghantt">
    <div class="foot-box master">begin</div>
    <p class="para-m">0</p>
</div>`
    boxes.style.display="flex";let j=0;

    for(let i=0;i<ghantt.length;i++){
        const element = ghantt[i][0];
        const flag = ghantt[i][1];

        if(flag===1){
        boxes.innerHTML+=`<div class="ghantt">
        <div class="foot-box">P${id[j]}</div>
        <p class="para-m">${element}</p>
         </div>`
         j++;
        }
        else{
        boxes.innerHTML+=`<div class="ghantt">
        <div class="foot-box"></div>
        <p class="para-m">${element}</p>
         </div>`
        }
        
    }
}
// function chartsrtf(ghantt,id) {
//     const boxes=document.getElementById("right-foot");
//     boxes.style.display="flex";
//     boxes.innerHTML="";
//     boxes.innerHTML+=`<div class="ghantt">
//     <div class="master">
//     </div>
//     <p class="para-m">0</p>
// </div>`

//     for(let i=0;i<ghantt.length;i++){
//         boxes.innerHTML+=`<div class="ghantt">
//         <div class="foot-box">P${id[i]}</div>
//         <p class="para-m">${ghantt[i]}</p>
//          </div>`
//     }
// }
function addtable(arrivalarr,burstarr,completionarr,turnaroundarr,waitingarr,id){
    const tableBody = document.getElementById("table-body");
    // Remove all existing rows from the table body
    tableBody.innerHTML = "";
        for (var i = 0; i < completionarr.length; i++) {
          var row = tableBody.insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          var cell5 = row.insertCell(4);
          var cell6 = row.insertCell(5);
          cell1.innerHTML = `P${id[i]}`;
          cell2.innerHTML = arrivalarr[i];
          cell3.innerHTML = burstarr[i];
          cell4.innerHTML = completionarr[i];
          cell5.innerHTML = turnaroundarr[i];
          cell6.innerHTML = waitingarr[i];
        }
}