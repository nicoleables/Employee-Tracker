const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');
const readline = require('readline');
const departments = ['Sales', 'Engineering', 'Finance', 'Legal']; 
const roles = ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']; 
const managerIds = [null, 1, 2, 3, 4, 5, 6, 7, 8];
const updateEmployeeRole = require('./updateEmployeeRole');


const app = express();
const PORT = process.env.PORT || 3002;

const pool = new Pool(
    {
        user: 'postgres',
        password: 'Nra2005!',
        network: 'localhost',
        database: 'employees_db',
    });

    function handleUserAction() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do',
            name: 'action',
            choices: [`View All Employees`, `Add Employees`, `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`],
        },
    ])
    .then((answers) => {
        const selectedAction = answers.action;
        switch (selectedAction) {
                case 'View All Employees':
                pool.query(`
                    SELECT 
                        e.id, 
                        e.first_name, 
                        e.last_name, 
                        r.title, 
                        d.name AS department, 
                        r.salary, 
                        CASE 
                            WHEN m.first_name IS NULL THEN 'NULL' 
                            ELSE CONCAT(m.first_name, ' ', m.last_name) 
                        END AS manager
                    FROM employees e
                    JOIN roles r ON e.role_id = r.id
                    JOIN departments d ON r.department = d.id
                    LEFT JOIN employees m ON e.manager_id = m.id;
                `, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(res.rows);
                    }
                    handleUserAction();
                });
                break;
          case 'Add Employees':
            const rlAddEmployee = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            function addEmployee() {
                let employeeFirst;
                let employeeLast;
                let employeeRole;
                let employeeManager;
            
                rlAddEmployee.question(`What is the employee's first name? `, (employeeFirst) => {
                    rlAddEmployee.question(`What is the employee's last name? `, (employeeLast) => {
                        inquirer.prompt({
                            type: 'list',
                            name: 'role',
                            message: `What is the employee's role?`,
                            choices: roles
                        }).then((answers) => {
                            const selectedRole = answers.role;
                            console.log(`Selected role: ${selectedRole}`);
            
                            // Get the employee role ID based on the selected role name
                            const selectedEmployeeRole = roles.indexOf(selectedRole) + 1; // Assuming role IDs start from 1
            
                            inquirer.prompt({
                                type: 'list',
                                name: 'manager',
                                message: `Who is the employee's manager?`,
                                choices: managerChoices  = ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriquez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen'] 
                            }).then((answers) => {
                                const selectedManagerName = answers.manager;
                                // Map the selected manager's name to the manager's ID
                                const selectedManagerId = managerIds[managerChoices.indexOf(selectedManagerName)];
            
                                console.log(`Employee's manager: ${selectedManagerName} (ID: ${selectedManagerId})`);
            
                                // Insert the employee into the database with the collected information
                                pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [employeeFirst, employeeLast, selectedEmployeeRole, selectedManagerId], (err, res) => {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log(`Added employee '${employeeFirst} ${employeeLast}' to the database`);
                                    }
                                    rlAddEmployee.close();
                                    handleUserAction();
                                });
                            });
                        });
                    });
                });
            }
            
            addEmployee();
              break;
              
              case 'View All Roles':
            pool.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department = departments.id;', (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  console.table(res.rows);
                }
                handleUserAction();
                });
                break;


                case 'Add Role':
                    const rlAddRole = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                
                    function addRole() {
                        let roleTitle;
                        let roleSalary;
                        let departmentId;
                    
                        rlAddRole.question('What is the name of the role? ', (roleTitle) => {
                            rlAddRole.question('What is the salary of the role? ', (roleSalary) => {
                                inquirer.prompt({
                                    type: 'list',
                                    name: 'department',
                                    message: 'Which department does the role belong to?',
                                    choices: departments
                                }).then((answers) => {
                                    const selectedDepartment = answers.department;
                    
                                    // Get the department ID based on the selected department name
                                    const selectedDepartmentId = departments.indexOf(selectedDepartment) + 1; // Assuming department IDs start from 1
                    
                                    // Insert the role into the database with the collected information
                                    pool.query('INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)', [roleTitle, roleSalary, selectedDepartmentId], (err, res) => {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            console.log(`Added role '${roleTitle}' to the database`);
                                        }
                                        rlAddRole.close();
                                        handleUserAction();
                                    });
                                });
                            });
                        });
                    }
                    
                    addRole();
                    break;
                    case 'View All Departments':
                        pool.query('SELECT * FROM departments;', (err, res) => {
                            if (err) {
                                console.error(err);
                            } else {
                                const departments = res.rows.map(row => ({ id: row.id, name: row.name }));
                                console.table(departments);
                            }
                            handleUserAction();
                        });
                        break;

                case 'Add Department':
                    function addDepartment() {
                        const rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                    
                        rl.question('What is the name of the department? ', (departmentName) => {
                            pool.query('INSERT INTO departments (name) VALUES ($1)', [departmentName], (err, res) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log(`Added '${departmentName}' to the database`);
                                }
                                rl.close();
                                handleUserAction();
                            });
                        });
                    }
                    
                    addDepartment();
                    break;
                    case 'Update Employee Role':
                updateEmployeeRole(pool).then(() => {
                    handleUserAction(); // Loop back to the initial prompt
                });
                break;
          default:
            console.log(`Action not recognized: ${answers.action}`);

            app.listen(PORT, () => {
                console.log('Hey you did it!');
            });
        }
      });
    }

    handleUserAction();

    pool.connect();