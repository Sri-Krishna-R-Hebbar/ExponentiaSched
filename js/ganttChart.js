function renderGanttChart(scheduledProcesses) {
  const canvas = document.getElementById("ganttChart");
  const ctx = canvas.getContext("2d");
  const barHeight = 90; // Height of each bar
  // const barSpacing = 10; // Space between bars

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  scheduledProcesses.forEach((process, index) => {
    const startX = process.startTime * 30; // Scale for better visibility
    const width = (process.endTime - process.startTime) * 30; // Scale for better visibility
    // const y = index * (barHeight + barSpacing); // Position each bar

    // Draw the rectangle
    ctx.fillStyle = "rgba(75, 192, 192, 0.5)";
    ctx.fillRect(startX, 0, width, barHeight);

    // Draw process ID
    ctx.fillStyle = "#000";
    ctx.fillText(`P${process.processId}`, startX + 5, 0 + 20);
  });
}