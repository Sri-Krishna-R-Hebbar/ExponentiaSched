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

// Render Comparison Chart
function renderComparisonChart(eadSchedule, fcfsSchedule, sjfSchedule) {
  const ctx = document.getElementById("comparisonChart").getContext("2d");

  const datasets = [
    {
      label: "EAD",
      backgroundColor: "rgba(75, 192, 192, 0.4)",
      data: eadSchedule.map(p => ({ x: p.startTime, y: p.processId, r: p.endTime - p.startTime }))
    },
    {
      label: "FCFS",
      backgroundColor: "rgba(192, 75, 75, 0.4)",
      data: fcfsSchedule.map(p => ({ x: p.startTime, y: p.processId, r: p.endTime - p.startTime }))
    },
    {
      label: "SJF",
      backgroundColor: "rgba(75, 75, 192, 0.4)",
      data: sjfSchedule.map(p => ({ x: p.startTime, y: p.processId, r: p.endTime - p.startTime }))
    }
  ];

  const data = {
    labels: eadSchedule.map(p => `P${p.processId}`),
    datasets: datasets
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Process ID'
        },
        ticks: {
          callback: (value) => `P${value}`,
        },
      }
    }
  };

  new Chart(ctx, {
    type: "bar", // Change to bar for rectangles
    data: data,
    options: options
  });
}

// Main script to handle data loading and rendering
document.addEventListener("DOMContentLoaded", () => {
  const processes = JSON.parse(localStorage.getItem("processes"));
  const eadResults = scheduleEAD(processes);
  const fcfsResults = fcfsScheduling(processes);
  const sjfResults = sjfScheduling(processes);

  renderComparisonChart(eadResults, fcfsResults, sjfResults);

  // Display metrics for comparison (e.g., total turnaround time, throughput)
  const eadTurnaround = eadResults[eadResults.length - 1].endTime;
  const fcfsTurnaround = fcfsResults[fcfsResults.length - 1].endTime;
  const sjfTurnaround = sjfResults[sjfResults.length - 1].endTime;

  document.getElementById("comparisonMetrics").innerHTML = `
    <h3>Comparison Metrics:</h3>
    <p><strong>EAD Turnaround Time:</strong> ${eadTurnaround}</p>
    <p><strong>FCFS Turnaround Time:</strong> ${fcfsTurnaround}</p>
    <p><strong>SJF Turnaround Time:</strong> ${sjfTurnaround}</p>
  `;
});
