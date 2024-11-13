// Import or define scheduleEAD, fcfsScheduling, and sjfScheduling functions

function calculatePriority(deadline, waitingTime) {
  return (1 / deadline) + Math.exp(waitingTime);
}

// EAD Scheduling
function scheduleEAD(processes) {
  let currentTime = 0;
  const scheduledProcesses = [];
  let remainingProcesses = processes.map(p => ({ ...p }));

  while (remainingProcesses.length > 0) {
    remainingProcesses.forEach(process => {
      if (process.arrivalTime <= currentTime) {
        process.waitingTime = Math.max(0, currentTime - process.arrivalTime);
        process.priority = calculatePriority(process.deadline, process.waitingTime);
      }
    });

    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    availableProcesses.sort((a, b) => b.priority - a.priority);

    if (availableProcesses.length > 0) {
      const nextProcess = availableProcesses[0];
      scheduledProcesses.push({
        processId: nextProcess.processId,
        startTime: currentTime,
        endTime: currentTime + nextProcess.burstTime,
      });
      currentTime += nextProcess.burstTime;
      remainingProcesses = remainingProcesses.filter(p => p.processId !== nextProcess.processId);
    } else {
      currentTime++;
    }
  }

  return scheduledProcesses;
}

// FCFS Scheduling
function fcfsScheduling(processes) {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const scheduledProcesses = [];

  sortedProcesses.forEach(process => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const endTime = startTime + process.burstTime;
    scheduledProcesses.push({
      processId: process.processId,
      startTime,
      endTime
    });
    currentTime = endTime;
  });

  return scheduledProcesses;
}

// SJF Scheduling (non-preemptive)
function sjfScheduling(processes) {
  let currentTime = 0;
  const scheduledProcesses = [];
  let remainingProcesses = processes.map(p => ({ ...p }));

  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    availableProcesses.sort((a, b) => a.burstTime - b.burstTime);

    if (availableProcesses.length > 0) {
      const nextProcess = availableProcesses[0];
      scheduledProcesses.push({
        processId: nextProcess.processId,
        startTime: currentTime,
        endTime: currentTime + nextProcess.burstTime,
      });
      currentTime += nextProcess.burstTime;
      remainingProcesses = remainingProcesses.filter(p => p.processId !== nextProcess.processId);
    } else {
      currentTime++;
    }
  }

  return scheduledProcesses;
}

// Render Gantt Chart for each scheduling algorithm
function renderGanttChart(scheduledProcesses, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const barHeight = 90;
  const chartHeight = 200; // Height for the canvas

  // Calculate total width based on the end time of the last process
  const totalTime = scheduledProcesses[scheduledProcesses.length - 1].endTime;
  const scaleFactor = 30; // Adjust this value to change the width of the bars
  canvas.width = totalTime * scaleFactor; // Set canvas width dynamically

  ctx.clearRect(0, 0, canvas.width, chartHeight);

  const colors = [
    "rgba(75, 192, 192, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)"
  ];

  // Draw the heading inside the canvas
  ctx.fillStyle = "#000"; // Black color for the heading
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Gantt Chart", canvas.width / 2, 30); // Centered heading

  scheduledProcesses.forEach((process, index) => {
    const startX = (process.startTime * scaleFactor); // Adjusted to start from the left
    const width = (process.endTime - process.startTime) * scaleFactor; 
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(startX, 50, width, barHeight);

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`P${process.processId}`, startX + 10, 50 + 20);
    ctx.font = "9px Arial";

    // Show start time only for the first process or if there's a gap
    if (index === 0 || (process.startTime > scheduledProcesses[index - 1].endTime)) {
      ctx.fillText(`${process.startTime}`, startX + 2, 50 + barHeight + 10); // Display start time
    }
    
    ctx.fillText(`${process.endTime}`, startX + width - 3, 50 + barHeight + 10); // Display end time
  });
}

// Main script to handle data loading and rendering
document.addEventListener("DOMContentLoaded", () => {
  const processes = JSON.parse(localStorage.getItem("processes"));

  // Check if processes data is available
  if (!processes || processes.length === 0) {
    console.error("No processes found in localStorage.");
    return;
  }

  const eadResults = scheduleEAD(processes);
  const fcfsResults = fcfsScheduling(processes);
  const sjfResults = sjfScheduling(processes);

  // Render Gantt charts for each algorithm
  renderGanttChart(eadResults, "eadGanttChart");
  renderGanttChart(fcfsResults, "fcfsGanttChart");
  renderGanttChart(sjfResults, "sjfGanttChart");

  // Calculate Average Waiting Time
  const eadAvgWaiting = eadResults.reduce((sum, p) => sum + (p.startTime - processes.find(proc => proc.processId === p.processId).arrivalTime), 0) / eadResults.length;
  const fcfsAvgWaiting = fcfsResults.reduce((sum, p) => sum + (p.startTime - processes.find(proc => proc.processId === p.processId).arrivalTime), 0) / fcfsResults.length;
  const sjfAvgWaiting = sjfResults.reduce((sum, p) => sum + (p.startTime - processes.find(proc => proc.processId === p.processId).arrivalTime), 0) / sjfResults.length;

  // Calculate Average Turnaround Time
  const eadAvgTurnaround = eadResults.reduce((sum, p) => sum + (p.endTime - processes.find(proc => proc.processId === p.processId).arrivalTime), 0) / eadResults.length;
  const fcfsAvgTurnaround = fcfsResults.reduce((sum, p) => sum + (p.endTime - processes.find(proc => proc.processId === p.processId).arrivalTime), 0) / fcfsResults.length;
  const sjfAvgTurnaround = sjfResults.reduce((sum, p) => sum + (p.endTime - processes.find(proc => proc.processId === p.processId).arrivalTime), 0) / sjfResults.length;

  // Calculate Throughput
  const totalTimeEAD = eadResults[eadResults.length - 1].endTime; // Total time for EAD
  const totalTimeFCFS = fcfsResults[fcfsResults.length - 1].endTime; // Total time for FCFS
  const totalTimeSJF = sjfResults[sjfResults.length - 1].endTime; // Total time for SJF

  const eadThroughput = processes.length / totalTimeEAD; // Throughput for EAD
  const fcfsThroughput = processes.length / totalTimeFCFS; // Throughput for FCFS
  const sjfThroughput = processes.length / totalTimeSJF; // Throughput for SJF

  // Update the comparison metrics table
  document.getElementById("comparisonMetrics").innerHTML = `
    <h3 style="color: black;">Comparison Metrics:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid black; padding: 8px; text-align: left;color: black;">Metric</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;color: black;">EAD</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;color: black;">FCFS</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;color: black;">SJF</th>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 8px;color: black;">Average Turnaround Time</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${eadAvgTurnaround.toFixed(2)}</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${fcfsAvgTurnaround.toFixed(2)}</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${sjfAvgTurnaround.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 8px;color: black;">Average Waiting Time</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${eadAvgWaiting.toFixed(2)}</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${fcfsAvgWaiting.toFixed(2)}</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${sjfAvgWaiting.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 8px;color: black;">Throughput</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${eadThroughput.toFixed(2)}</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${fcfsThroughput.toFixed(2)}</td>
        <td style="border: 1px solid black; padding: 8px;color: black;">${sjfThroughput.toFixed(2)}</td>
      </tr>
    </table>
  `;

  // Prepare data for charts
  const labels = ['EAD', 'FCFS', 'SJF'];
  const avgTurnaroundData = [eadAvgTurnaround, fcfsAvgTurnaround, sjfAvgTurnaround];
  const avgWaitingData = [eadAvgWaiting, fcfsAvgWaiting, sjfAvgWaiting];
  const throughputData = [eadThroughput, fcfsThroughput, sjfThroughput];

  // Function to create a chart
  function createChart(ctx, chartType, labels, data, title) {
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Render the charts
  const avgTurnaroundCtx = document.getElementById('avgTurnaroundChart').getContext('2d');
  createChart(avgTurnaroundCtx, 'bar', labels, avgTurnaroundData, 'Average Turnaround Time');

  const avgWaitingCtx = document.getElementById('avgWaitingChart').getContext('2d');
  createChart(avgWaitingCtx, 'bar', labels, avgWaitingData, 'Average Waiting Time');

  const throughputCtx = document.getElementById('throughputChart').getContext('2d');
  createChart(throughputCtx, 'bar', labels, throughputData, 'Throughput');

  // After calculating average waiting time, average turnaround time, and throughput

// Calculate scores for each algorithm
const weights = {
  turnaround: 0.4, // Weight for average turnaround time (lower is better)
  waiting: 0.4,    // Weight for average waiting time (lower is better)
  throughput: 0.2   // Weight for throughput (higher is better)
};

// Normalize the values for scoring
const eadScore = (eadAvgTurnaround * weights.turnaround) + (eadAvgWaiting * weights.waiting) - (eadThroughput * weights.throughput);
const fcfsScore = (fcfsAvgTurnaround * weights.turnaround) + (fcfsAvgWaiting * weights.waiting) - (fcfsThroughput * weights.throughput);
const sjfScore = (sjfAvgTurnaround * weights.turnaround) + (sjfAvgWaiting * weights.waiting) - (sjfThroughput * weights.throughput);

// Prepare data for the pie chart
const scores = [eadScore, fcfsScore, sjfScore];
const labelsForPie = ['EAD', 'FCFS', 'SJF'];

// Function to create a pie chart
function createPieChart(ctx, labels, data) {
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)'
        ],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Effectiveness of Scheduling Algorithms'
        }
      }
    }
  });
}

// Render the pie chart
const effectivenessCtx = document.getElementById('effectivenessChart').getContext('2d');
createPieChart(effectivenessCtx, labelsForPie, scores);
});