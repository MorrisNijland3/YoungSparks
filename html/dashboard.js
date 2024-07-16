document.addEventListener('DOMContentLoaded', (event) => {
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
                'Miel Tiebie': 0,
                'Morris Nijland': 0,
                'Steijn van Buuren': 0,
                'Thijmen Buurs': 0,
                'Tijn de Ruijter': 0,
                'Sharon Swart': 0
            };
            const overdueCounts = {...assigneeCounts};
            let totalTasks = 0;
            let totalOverdue = 0;

            projects.forEach(project => {
                data[project].forEach(task => {
                    const dueDate = task[2];
                    const currentDate = new Date();
                    const isOverdue = dueDate && new Date(dueDate) < currentDate;

                    if (task.length > 1 && Array.isArray(task[1]) && task[1].length > 0) {
                        task[1].forEach(assignee => {
                            if (typeof assignee === 'string' && assignee.includes(' ')) {
                                assigneeCounts[assignee] = (assigneeCounts[assignee] || 0) + 1;
                                totalTasks++;
                                if (isOverdue) {
                                    overdueCounts[assignee] = (overdueCounts[assignee] || 0) + 1;
                                    totalOverdue++;
                                }
                            }
                        });
                    }
                });
            });

            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('totalOverdue').textContent = totalOverdue;

            const ctx = document.getElementById('tasksChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(assigneeCounts),
                    datasets: [{
                        label: 'Taken toegewezen',
                        data: Object.values(assigneeCounts),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Waarvan te laat',
                        data: Object.values(overdueCounts),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
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

            const ctx2 = document.getElementById('projectsChart').getContext('2d');
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        label: 'Taken per Klant',
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
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
        });
});
