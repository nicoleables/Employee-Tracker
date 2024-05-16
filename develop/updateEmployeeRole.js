const inquirer = require('inquirer');

const updateEmployeeRole = async (pool) => {
    let continueUpdating = true;

    while (continueUpdating) {
        try {
            const employees = await pool.query('SELECT * FROM employees');
            const employeeChoices = employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));

            const selectedEmployee = await inquirer.prompt({
                type: 'list',
                name: 'employeeId',
                message: 'Which employee do you want to update?',
                choices: employeeChoices,
            });

            const roles = await pool.query('SELECT * FROM roles');
            const roleChoices = roles.rows.map(role => ({
                name: role.title,
                value: role.id,
            }));

            const selectedRole = await inquirer.prompt({
                type: 'list',
                name: 'roleId',
                message: 'Which role do you want to assign?',
                choices: roleChoices,
            });

            // Update employee role in the database
            await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [selectedRole.roleId, selectedEmployee.employeeId]);

            console.log('Employee role updated successfully!');

            const answer = await inquirer.prompt({
                type: 'confirm',
                name: 'continue',
                message: 'Do you want to update another employee role?',
            });

            continueUpdating = answer.continue;
        } catch (err) {
            console.error(err);
        }
    }
};

module.exports = updateEmployeeRole;