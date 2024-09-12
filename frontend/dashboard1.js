function fetchAndUpdateData() {
    fetch('dashboard.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const projects = Object.keys(data);

            const assigneeCounts = {
                'Alec van der Schuit': 0,
                'Amber Schouten': 0,
                'Daan Bakker': 0,
                'Ewout Vet': 0,
                'Jim Struikenkamp': 0,
                'Julia van Kalken': 0,
                'Julia Klaver': 0,
                'Leonie van der Park': 0,
                'Mart Cabooter': 0,
                'Miel Tiebie': 0,
                'Morris Nijland': 0,
                'Sharon Swart': 0,
                'Steijn van Buuren': 0,
                'Thijmen Buurs': 0,
                'Tijn de Ruijter': 0
            };
            const overdueCounts = { ...assigneeCounts };
            const startedCounts = { ...assigneeCounts };
            const notstartedCounts = { ...assigneeCounts};
            let totalTasks = 0;
            let totalOverdue = 0;
            let totalStarted = 0;
            let totalNotStarted = 0;

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
                                assigneeCounts[assignee] = (assigneeCounts[assignee] || 0) + 1;
                                totalTasks++;
                                if (isOverdue) {
                                    overdueCounts[assignee] = (overdueCounts[assignee] || 0) + 1;
                                    totalOverdue++;
                                }
                                if (isStarted) {
                                    startedCounts[assignee] = (startedCounts[assignee] || 0) + 1;
                                    totalStarted++;
                                }
                                if (isNotStarted) {
                                    notstartedCounts[assignee] = (notstartedCounts[assignee] || 0) + 1;
                                    totalNotStarted++;
                                }
                            }
                        });
                    }
                });
            });

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
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchAndUpdateData();
 // 3600000
    setInterval(fetchAndUpdateData, 3600000); 
});
