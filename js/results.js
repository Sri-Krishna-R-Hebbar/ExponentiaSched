document.addEventListener("DOMContentLoaded", () => {
  const processes = JSON.parse(localStorage.getItem("processes"));
  const scheduledProcesses = scheduleEAD(processes);

  renderGanttChart(scheduledProcesses);

  // Calculate metrics
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const turnaroundTime = scheduledProcesses[scheduledProcesses.length - 1].endTime;
  const waitingTime = turnaroundTime - totalBurstTime;
  const throughput = processes.length / turnaroundTime;

  document.getElementById("metricsTable").innerHTML = `
    <h3>Metrics:</h3>
    <p><strong>Total Burst Time:</strong> ${totalBurstTime}</p>
    <p><strong>Turnaround Time:</strong> ${turnaroundTime}</p>
    <p><strong>Waiting Time:</strong> ${waitingTime}</p>
    <p><strong>Throughput:</strong> ${throughput.toFixed(2)} processes/unit time</p>
  `;
});