# Exponential Aging Deadline (EAD) Scheduling

This project is a web-based application that visualizes process scheduling algorithms using a Gantt chart. It provides an interactive UI for users to input process details (like burst time, arrival time, and deadlines) and displays the scheduling results with calculated metrics. The application also supports comparisons between different scheduling algorithms.

## Features

- **Process Scheduling Visualization**: Visualizes process scheduling using Gantt charts.
- **Metrics Calculation**: Displays key metrics, such as total burst time, turnaround time, waiting time, and throughput.
- **Animations**: Processes are animated to show the order of execution.
- **Comparison**: Allows users to compare different scheduling algorithms.

## Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Sri-Krishna-R-Hebbar/ExponentiaSched.git
    cd ExponentiaSched
    ```

## Using Tailwind CSS

### Adding Tailwind for Custom Styling

To customize the UI with Tailwind, follow these steps:

1. **Install Tailwind CSS** (recommended for more control over styling):
    ```bash
    npm install -D tailwindcss
    ```

2. **Build Tailwind CSS**:
    - Run the following command to generate your CSS file:
      ```bash
      npx tailwindcss -i ./styles.css -o ./output.css --watch
      ```
    - Then, include `output.css` in your HTML files.

    
## Usage

1. **Enter Process Details**:
    - Go to the input page, enter the number of processes, and fill in the details (Process ID, Burst Time, Arrival Time, Deadline).
    - Click "Submit" to schedule the processes based on the selected algorithm (EAD by default).

2. **View Gantt Chart and Metrics**:
    - The Gantt chart will display the scheduling of each process with animated transitions.
    - The metrics section below the Gantt chart shows total burst time, turnaround time, waiting time, and throughput.

3. **Comparison**:
    - Go to the comparison page to visualize and compare the Gantt charts for different scheduling algorithms side by side.


## Future Scope

1. **Enhanced Scheduling Algorithms**: Add support for more scheduling algorithms like Priority Scheduling, Round Robin, and Multilevel Queue Scheduling to provide users with a more comprehensive comparison.
  
2. **Interactive Animations**: Include more animations and transitions for the Gantt chart to improve user engagement and understanding.

3. **Data Export**: Enable exporting of the Gantt chart and metrics as PDF or PNG for easy sharing and reporting.

4. **Advanced Metrics Analysis**: Expand the metrics section to include additional information like average response time and CPU utilization.

5. **Mobile Responsiveness**: Use Tailwind's responsive classes to ensure the application works smoothly on different screen sizes.

## Acknowledgments

- [Sri Krishna R Hebbar](https://github.com/Sri-Krishna-R-Hebbar) - contributed extensively to the development of core JavaScript logic for scheduling algorithms and Gantt chart rendering. 
- [Sushruth V Kamble](https://github.com/Sushruthvi) - led UI/UX improvements, designing an intuitive interface and enhancing overall aesthetics for a better user experience.
