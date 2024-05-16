INSERT INTO departments (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

SELECT * FROM departments;

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

SELECT roles.id, roles.title, departments.name AS department, roles.salary
FROM roles
JOIN departments ON roles.department = departments.id;

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriquez', 3, null),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, null),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, null),
('Tom', 'Allen', 8, 7);

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