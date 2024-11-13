document.getElementById('generateFormButton').addEventListener('click', function () {
  const numProcesses = parseInt(document.getElementById('numProcesses').value);
  
  if (numProcesses > 0) {
    const processForm = document.getElementById('processForm');
    const processInputs = document.getElementById('processInputs');
    processInputs.innerHTML = '';

    for (let i = 1; i <= numProcesses; i++) {
      const fieldset = document.createElement('fieldset');
      fieldset.classList.add('border', 'border-gray-300', 'p-4', 'mb-4', 'rounded-md');

      const processIdLabel = document.createElement('label');
      processIdLabel.classList.add('block', 'text-white-700');
      processIdLabel.innerText = `Process ${i} ID:`;
      const processIdInput = document.createElement('input');
      processIdInput.type = 'text';
      processIdInput.name = `processId_${i}`;
      processIdInput.classList.add('mt-1', 'block', 'w-full','text-black');
      processIdInput.required = true;
      processIdLabel.appendChild(processIdInput);
      fieldset.appendChild(processIdLabel);

      const burstTimeLabel = document.createElement('label');
      burstTimeLabel.classList.add('block', 'text-white-700', 'mt-2');
      burstTimeLabel.innerText = `Process ${i} Burst Time:`;
      const burstTimeInput = document.createElement('input');
      burstTimeInput.type = 'number';
      burstTimeInput.name = `burstTime_${i}`;
      burstTimeInput.classList.add('mt-1', 'block', 'w-full','text-black');
      burstTimeInput.required = true;
      burstTimeInput.min = 1;
      burstTimeLabel.appendChild(burstTimeInput);
      fieldset.appendChild(burstTimeLabel);

      const arrivalTimeLabel = document.createElement('label');
      arrivalTimeLabel.classList.add('block', 'text-white-700', 'mt-2');
      arrivalTimeLabel.innerText = `Process ${i} Arrival Time:`;
      const arrivalTimeInput = document.createElement('input');
      arrivalTimeInput.type = 'number';
      arrivalTimeInput.name = `arrivalTime_${i}`;
      arrivalTimeInput.classList.add('mt-1', 'block', 'w-full','text-black');
      arrivalTimeInput.required = true;
      arrivalTimeInput.min = 0;
      arrivalTimeLabel.appendChild(arrivalTimeInput);
      fieldset.appendChild(arrivalTimeLabel);

      const deadlineLabel = document.createElement('label');
      deadlineLabel.classList.add('block', 'text-white-700', 'mt-2');
      deadlineLabel.innerText = `Process ${i} Deadline:`;
      const deadlineInput = document.createElement('input');
      deadlineInput.type = 'number';
      deadlineInput.name = `deadline_${i}`;
      deadlineInput.classList.add('mt-1', 'block', 'w-full','text-black');
      deadlineInput.required = true;
      deadlineInput.min = 1;
      deadlineLabel.appendChild(deadlineInput);
      fieldset.appendChild(deadlineLabel);

      processInputs.appendChild(fieldset);
    }

    processForm.classList.remove('hidden');
  } else {
    alert("Please enter a valid number of processes.");
  }
});

document.getElementById('processForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const numProcesses = parseInt(document.getElementById('numProcesses').value);
  const processes = [];

  for (let i = 1; i <= numProcesses; i++) {
    const processId = formData.get(`processId_${i}`);
    const burstTime = parseInt(formData.get(`burstTime_${i}`));
    const arrivalTime = parseInt(formData.get(`arrivalTime_${i}`));
    const deadline = parseInt(formData.get(`deadline_${i}`));

    processes.push({ processId, burstTime, arrivalTime, deadline });
  }

  localStorage.setItem('processes', JSON.stringify(processes));
  window.location.href = 'results.html';
});
