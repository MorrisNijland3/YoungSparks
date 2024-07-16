fetch('dashboard.json')
    .then(response => response.json())
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
        const projectCounts = {}; 

        projects.forEach(project => {
            projectCounts[project] = 0; 
            data[project].forEach(task => {
                projectCounts[project]++; 

                const dueDate = task[2]; // Assumes the due date is always at index 2
                const currentDate = new Date();
                const isOverdue = dueDate && new Date(dueDate) < currentDate;

                if (task.length > 1 && Array.isArray(task[1]) && task[1].length > 0) {
                    task[1].forEach(assignee => {
                        // Check if assignee is a person with first name and last name
                        if (typeof assignee === 'string' && assignee.includes(' ')) {
                            assigneeCounts[assignee] = (assigneeCounts[assignee] || 0) + 1;
                            if (isOverdue) {
                                overdueCounts[assignee] = (overdueCounts[assignee] || 0) + 1;
                            }
                        }
                    });
                } else {
                    console.error('Invalid task format or missing assignees:', task);
                }
            });
        });

        // First chart for individuals
        const assignees = Object.keys(assigneeCounts);
        const taskCounts = Object.values(assigneeCounts);
        const overdueTasks = Object.values(overdueCounts);
        const ctx = document.getElementById('tasksChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: assignees,
                datasets: [{
                    label: 'Taken toegewezen',
                    data: taskCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }, {
                    label: 'Waarvan te laat',
                    data: overdueTasks,
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

        // Second chart for projects
        const projectNames = Object.keys(projectCounts);
        const projectTaskCounts = Object.values(projectCounts);
        const ctx2 = document.getElementById('projectsChart').getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: projectNames,
                datasets: [{
                    label: 'Taken per Project',
                    data: projectTaskCounts,
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
                            text: 'Projecten'
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching or parsing data:', error);
    });
