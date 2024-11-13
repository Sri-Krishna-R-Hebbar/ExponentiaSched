function renderGanttChart(scheduledProcesses) {
  const canvas = document.getElementById("ganttChart");
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