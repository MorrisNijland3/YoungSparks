fetch('dashboard.json')
    .then(response => response.json())
    .then(data => {
        const projects = Object.keys(data);
        const assigneeCounts = {};

        projects.forEach(project => {
            data[project].forEach(task => {
                task[1].forEach(assignee => {
                    // Check if assignee is a person with first name and last name
                    if (typeof assignee === 'string' && assignee.includes(' ')) {
                        if (assigneeCounts[assignee]) {
                            assigneeCounts[assignee]++;
                        } else {
                            assigneeCounts[assignee] = 1;
                        }
                    }
                });
            });
        });

        const assignees = Object.keys(assigneeCounts);
        const taskCounts = Object.values(assigneeCounts);

        const ctx = document.getElementById('tasksChart').getContext('2d');
        const tasksChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: assignees,
                datasets: [{
                    label: 'Taken toegewezen',
                    data: taskCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
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
    })
    .catch(error => {
        console.error('Error fetching or parsing data:', error);
    });
