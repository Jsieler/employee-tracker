const express = require('express');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


const init = () => {
  inquirer.prompt([
    {
      name: 'menu',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        { name: 'view all departments', value: 'VIEW_ALL_DEPARTMENTS' },
        { name: 'view all roles', value: 'VIEW_ALL_ROLES' },
        { name: 'view all employees', value: 'VIEW_ALL_EMPLOYEES' },
        { name: 'add a role', value: 'ADD_A_ROLE' },
        { name: 'add an emmployee', value: 'ADD_AN_EMPLOYEE' },
        { name: 'update an employee role', value: 'UPDATE_AN_EMPLOYEE_ROLE' }
      ]
    }
  ]).then(choices => {
    switch (choices.menu) {
      case 'VIEW_ALL_DEPARTMENTS':
        viewDepartments();
        break;
      case 'VIEW_ALL_ROLES':
        viewRoles();
        break;
      case 'VIEW_ALL_EMPLOYEES':
        viewEmployees();
        break;
      case 'ADD_A_ROLE':
        addRole();
        break;
      case 'ADD_AN_EMPLOYEE':
        addEmployee();
        break;
      case 'UPDATE_AN_EMPLOYEE_ROLE':
        updateEmployee();
        break;

    };
  });
};

// View all Departments
const viewDepartments = () => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    init();
  });
}

// View Roles
const viewRoles = () => {
  const sql = `SELECT role.id, role.title AS role,
  department.name AS department FROM role
  LEFT JOIN department ON role.department_id = department.id
  ORDER BY department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    init();
  });
}

// View Employess 
const viewEmployees = () => {
  const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  JOIN role ON(role.id = employee.role_id)
  JOIN department ON(department.id = role.department_id)
  ORDER BY role.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    init();
  });
}

const addRole = () => {

}

const addEmployee = () => {

}

const updateEmployee = () => {

}



init();