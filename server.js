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
        { name: 'add a department', value: 'ADD_A_DEPARTMENT' },
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
      case 'ADD_A_DEPARTMENT':
        addDepartment();
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
  console.log(`
================
  DEPARTMENTS
================
`);
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
  console.log(`
=========
  ROLES
=========
`);
  const sql = `SELECT role.id, role.title AS job_title, role.salary,
  department.name AS department FROM role
  LEFT JOIN department ON role.department_id = department.id
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

// View Employess 
const viewEmployees = () => {
  console.log(`
===============
   EMPLOYEES
===============
`);
  const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  JOIN role ON(role.id = employee.role_id)
  JOIN department ON(department.id = role.department_id)
  ORDER BY employee.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    init();
  });
}

// Add new Department
const addDepartment = () => {
  console.log(`
=====================
    ADD DEPARTMENT
=====================
`);

  inquirer.prompt([
    {
      type: 'input',
      name: 'departName',
      message: 'Which department would you like to add?',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter a department name!');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      let newDepartment = answer.departName;

      db.query('INSERT INTO department SET name=? ', [newDepartment], (err, res) => {
        if (err) throw err;

        console.log(res.affectedRows + ' Department added!\n');
        init();
      })
    });
}

// Add New Role
const addRole = () => {
  console.log(`
================
    ADD ROLE
================
`);
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleTitle',
      message: 'Add a new role title!',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter a role title!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'Add a new role salary!',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter a role salary!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'roleDepId',
      message: 'Add a department id for the new role!',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter an id!');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      let newRole = answer.roleTitle;
      let newSalary = answer.roleSalary;
      let newRoleId = answer.roleDepId;


      db.query('INSERT INTO role (title, salary, department_id) Values (?,?,?) ', [newRole, newSalary, newRoleId], (err, res) => {
        if (err) throw err;

        console.log(res.affectedRows + ' Role added!\n');
        init();
      })
    });
}

// Add New Employee
const addEmployee = () => {
  console.log(`
=====================
    ADD EMPLOYEE
=====================
`);
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Whats employees first name?',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter a name!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Whats employees last name?',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter a name!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'empRoleId',
      message: 'Add an role id for employee!',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter an id!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'mangId',
      message: 'Please enter employees manager ID',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter an id!');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      let newFirstName = answer.firstName;
      let newLastName = answer.lastName;
      let newEmpID = answer.empRoleId;
      let newMangID = answer.mangId


      db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) Values (?,?,?,?) ', [newFirstName, newLastName, newEmpID, newMangID], (err, res) => {
        if (err) throw err;

        console.log(res.affectedRows + ' Employee added!\n');
        init();
      })
    });
}

const updateEmployee = () => {
  console.log(`
=====================
    UPDATE EMPLOYEE
=====================
`);
  inquirer.prompt([
    {
      type: 'number',
      name: 'updateEmployee',
      message: 'Enter employees ID number you wish to update!',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please enter employee ID!');
          return false;
        }
      }
    },
    {
      type: 'number',
      name: 'updateRole',
      message: 'Please update the employees new role',
      validate: (answer) => {
        if (answer) {
          return true;
        } else {
          console.log('Please input a new role id!');
          return false;
        }
      }
    }
  ])

    .then((answer) => {
      db.query(
        `UPDATE employee SET role_id = ${answer.updateRole} WHERE id = ${answer.updateEmployee}`, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + ' Employee Updated!\n');
          init();
        })
    });
};

    
 




init();
