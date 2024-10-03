function fetchEmployeeData() {
    return fetch('werknemers.txt')
        .then(response => response.text())
        .then(text => {
            const assigneeCounts = {};
            const lines = text.split('\n');
            lines.forEach(line => {
                const [id, name] = line.split(' = ');
                if (name) {
                    assigneeCounts[name.trim()] = 0;
                }
            });
            return assigneeCounts;
        });
}

function fetchAndUpdateData() {
    fetchEmployeeData().then(assigneeCounts => {
        const overdueCounts = { ...assigneeCounts };
        const startedCounts = { ...assigneeCounts };
        const notStartedCounts = { ...assigneeCounts };

        let totalTasks = 0;
        let totalOverdue = 0;
        let totalStarted = 0;
        let totalNotStarted = 0;

        fetch('dashboard.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const projects = Object.keys(data);

                projects.forEach(project => {
                    data[project].forEach(task => {
                        const dueDateStr = task[2];  // Field with due date or "Geen datum."
                        const startedStr = task[3];  // Field with task status (e.g., "50" or "0")
                        
                        // If the task has a valid due date
                        if (dueDateStr !== 'Geen datum.') {
                            totalTasks++;  // Count total tasks
                        }

                        // Check if the task is overdue
                        const isOverdue = dueDateStr.startsWith('Te laat.');
                        if (isOverdue) {
                            totalOverdue++;  // Count total overdue tasks
                        }

                        // Check if the task is started
                        const isStarted = startedStr === "50" && dueDateStr !== 'Geen datum.';
                        if (isStarted) {
                            totalStarted++;  // Count total started tasks
                        }

                        // Check if the task is not started
                        const isNotStarted = startedStr === "0" && dueDateStr !== 'Geen datum.';
                        if (isNotStarted) {
                            totalNotStarted++;  // Count total not started tasks
                        }

                        // Assign tasks to employees and update counts per employee
                        if (task.length > 1 && Array.isArray(task[1]) && task[1].length > 0) {
                            task[1].forEach(assignee => {
                                if (typeof assignee === 'string' && assigneeCounts.hasOwnProperty(assignee)) {
                                    assigneeCounts[assignee] += 1;

                                    if (isOverdue) {
                                        overdueCounts[assignee] += 1;
                                    }
                                    if (isStarted) {
                                        startedCounts[assignee] += 1;
                                    }
                                    if (isNotStarted) {
                                        notStartedCounts[assignee] += 1;
                                    }
                                }
                            });
                        }
                    });
                });

                // Update the UI totals
                document.getElementById('totalTasks').textContent = totalTasks;
                document.getElementById('totalOverdue').textContent = totalOverdue;
                document.getElementById('totalStarted').textContent = totalStarted;
                document.getElementById('totalNotStarted').textContent = totalNotStarted;

                // Update the tasks chart
                const tasksCtx = document.getElementById('tasksChart').getContext('2d');
                if (window.myChart1) {
                    myChart1.data.labels = Object.keys(assigneeCounts);
                    myChart1.data.datasets[0].data = Object.values(assigneeCounts);  // Total tasks per employee
                    myChart1.data.datasets[1].data = Object.values(overdueCounts);   // Overdue tasks per employee
                    myChart1.data.datasets[2].data = Object.values(startedCounts);   // Started tasks per employee
                    myChart1.data.datasets[3].data = Object.values(notStartedCounts);  // Not started tasks per employee
                    myChart1.update();
                } else {
                    window.myChart1 = new Chart(tasksCtx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(assigneeCounts),  // Employee names
                            datasets: [{
                                label: 'Totaal toegewezen',
                                data: Object.values(assigneeCounts),
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }, {
                                label: 'Te laat',
                                data: Object.values(overdueCounts),
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1
                            }, {
                                label: 'Uitvoeren',
                                data: Object.values(startedCounts),
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }, {
                                label: 'Niet gestart',
                                data: Object.values(notStartedCounts),
                                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Hoeveelheid taken'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Personen'
                                    }
                                }
                            }
                        }
                    });
                }

                // Update the projects chart
                const projectsCtx = document.getElementById('projectsChart').getContext('2d');
                if (window.myChart2) {
                    myChart2.data.labels = Object.keys(data);
                    myChart2.data.datasets[0].data = Object.values(data).map(tasks => tasks.length);  // Number of tasks per project
                    myChart2.update();
                } else {
                    window.myChart2 = new Chart(projectsCtx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(data),
                            datasets: [{
                                label: 'Taken',
                                data: Object.values(data).map(tasks => tasks.length),
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Hoeveelheid taken'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Klanten'
                                    }
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching or parsing data:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchAndUpdateData();
    setInterval(fetchAndUpdateData, 900000); // Refresh every 15 minutes
});
