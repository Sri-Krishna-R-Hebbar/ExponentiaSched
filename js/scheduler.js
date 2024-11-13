function calculatePriority(deadline, waitingTime) {
  return (1 / deadline) + Math.exp(waitingTime);
}

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

    // Filter processes that have arrived and sort them by priority
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

      // Remove the executed process from remainingProcesses
      remainingProcesses = remainingProcesses.filter(p => p.processId !== nextProcess.processId);
    } else {
      // If no process is available, increment the time
      currentTime++;
    }
  }

  return scheduledProcesses;
}
