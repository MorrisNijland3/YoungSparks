feather.replace();

function toggleNav() {
    var nav = document.querySelector('.navbar');
    var body = document.querySelector('body');
    var computedStyle = window.getComputedStyle(nav).left;
    if (computedStyle === '-250px') {
        nav.style.left = '0'; 
        body.style.marginLeft = '250px';
    } else {
        nav.style.left = '-250px'; 
        body.style.marginLeft = '0';
    }
}

function populateTable(data) {
    const table = document.getElementById('task-table');

    for (const project in data) {
        const tasks = data[project];

        tasks.forEach((task, index) => {
            const row = table.insertRow();

            if (index === 0) {
                const projectCell = row.insertCell(0);
                projectCell.rowSpan = tasks.length;
                projectCell.innerText = project;
                projectCell.classList.add('project-header');
            }

            const taskCell = row.insertCell(-1);
            taskCell.innerText = task[1] || ''; 

            const assigneesCell = row.insertCell(-1);
            assigneesCell.innerText = task[2] && task[2].length > 0 ? task[2].join(', ') : '';
            const dueDateCell = row.insertCell(-1);
            dueDateCell.innerText = task[3] || ''; 
        });
    }
}

fetch('plannen.json')
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error('Error fetching data:', error));

 