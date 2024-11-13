document.addEventListener("DOMContentLoaded", () => {
  const processes = JSON.parse(localStorage.getItem("processes"));
  const { scheduledProcesses, priorityLog } = scheduleEAD(processes); // Destructure to get both

  renderGanttChart(scheduledProcesses);

  // Calculate metrics
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const turnaroundTimes = scheduledProcesses.map((process, index) => {
    return process.endTime - processes.find(p => p.processId === process.processId).arrivalTime;
  });
  const totalTurnaroundTime = turnaroundTimes.reduce((sum, time) => sum + time,  0);
  const avgTurnaroundTime = totalTurnaroundTime / scheduledProcesses.length;

  const waitingTimes = scheduledProcesses.map((process, index) => {
    return process.startTime - processes.find(p => p.processId === process.processId).arrivalTime;
  });
  const totalWaitingTime = waitingTimes.reduce((sum, time) => sum + time, 0);
  const avgWaitingTime = totalWaitingTime / scheduledProcesses.length;

  const throughput = processes.length / scheduledProcesses[scheduledProcesses.length - 1].endTime;

  document.getElementById("metricsTable").innerHTML = `
    <h3 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Metrics:</h3>
    <p><strong>Total Burst Time:</strong> ${totalBurstTime}</p>
    <p><strong>Total Turnaround Time:</strong> ${totalTurnaroundTime}</p>
    <p><strong>Average Turnaround Time:</strong> ${avgTurnaroundTime.toFixed(2)} unit time</p>
    <p><strong>Average Waiting Time:</strong> ${avgWaitingTime.toFixed(2)} unit time</p>
    <p><strong>Throughput:</strong> ${throughput.toFixed(2)} processes/unit time</p>
  `;

  // Generate step-by-step solution
  const steps = generateSteps(processes, scheduledProcesses, priorityLog);
  document.getElementById("solutionSteps").innerHTML = steps;
});

function generateSteps(processes, scheduledProcesses, priorityLog) {
  let steps = `<h3 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Step-by-Step Solution:</h3>`;
  steps += `<ol>`;
  
  // Initial Setup
  steps += `<li><strong>Input Data:</strong><br>`;
  processes.forEach(p => {
    steps += `Process ID: ${p.processId}, Arrival Time: ${p.arrivalTime}, Burst Time: ${p.burstTime}, Deadline: ${p.deadline}<br>`;
  });
  steps += `</li>`;

  // Execution Steps
  let currentTime = 0;
  steps += `<strong>Priority Calculations:</strong><br>`;
  scheduledProcesses.forEach((process, index) => {
    steps += `<li>Time ${currentTime}: Executing Process with ID: ${process.processId}<br>`;
    steps += `Start Time: ${currentTime}, End Time: ${process.endTime}<br>`;
    
    // Show priority calculations for this time step
    const prioritiesAtTime = priorityLog.filter(log => log.time === currentTime || log.processId === process.processId);
    prioritiesAtTime.forEach(log => {
      steps += `Process ID: ${log.processId}, Waiting Time: ${log.waitingTime}, Deadline: ${log.deadline} <br> Priority = 1 /${log.deadline} + e^${log.waitingTime} = ${log.priority.toFixed(2)}<br>`;
    });

    currentTime = process.endTime;
  });

  steps += `</li></ol>`;
  return steps;
}