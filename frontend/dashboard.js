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
    // First, fetch the employee data
    fetchEmployeeData().then(assigneeCounts => {
        // Initialize other counts based on fetched names
        const overdueCounts = { ...assigneeCounts };
        const startedCounts = { ...assigneeCounts };
        const notstartedCounts = { ...assigneeCounts };
        let totalTasks = 0;
        let totalOverdue = 0;
        let totalStarted = 0;
        let totalNotStarted = 0;

        // Now, fetch the dashboard.json data
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
                        const dueDateStr = task[2];
                        const startedStr = task[3]; 
                        const isOverdue = dueDateStr.startsWith('Te laat.');
                        
                        const isStarted = startedStr === "50";
                        const isNotStarted = startedStr === "0";

                        if (task.length > 1 && Array.isArray(task[1]) && task[1].length > 0) {
                            task[1].forEach(assignee => {
                                if (typeof assignee === 'string' && assigneeCounts.hasOwnProperty(assignee)) {
                                    assigneeCounts[assignee] += 1;
                                    totalTasks++;
                                    if (isOverdue) {
                                        overdueCounts[assignee] += 1;
                                        totalOverdue++;
                                    }
                                    if (isStarted) {
                                        startedCounts[assignee] += 1;
                                        totalStarted++;
                                    }
                                    if (isNotStarted) {
                                        notstartedCounts[assignee] += 1;
                                        totalNotStarted++;
                                    }
                                }
                            });
                        }
                    });
                });

                // Update the UI
                document.getElementById('totalTasks').textContent = totalTasks;
                document.getElementById('totalOverdue').textContent = totalOverdue;
                document.getElementById('totalStarted').textContent = totalStarted;
                document.getElementById('totalNotStarted').textContent = totalNotStarted;

                const tasksCtx = document.getElementById('tasksChart').getContext('2d');
                const projectsCtx = document.getElementById('projectsChart').getContext('2d');

                if (window.myChart1) {
                    myChart1.data.labels = Object.keys(assigneeCounts);
                    myChart1.data.datasets[0].data = Object.values(assigneeCounts);
                    myChart1.data.datasets[1].data = Object.values(overdueCounts);
                    myChart1.data.datasets[2].data = Object.values(startedCounts);
                    myChart1.data.datasets[3].data = Object.values(notstartedCounts);
                    myChart1.update();
                } else {
                    window.myChart1 = new Chart(tasksCtx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(assigneeCounts),
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
                                data: Object.values(notstartedCounts),
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

                if (window.myChart2) {
                    myChart2.data.labels = Object.keys(data);
                    myChart2.data.datasets[0].data = Object.values(data).map(tasks => tasks.length);
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
    setInterval(fetchAndUpdateData, 1800000); // Every half an hour
});
