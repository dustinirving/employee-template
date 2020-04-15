const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Questions for the manager
const managerQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is the manager's name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is the manager's id number?",
  },
  {
    type: "input",
    name: "email",
    message: "What is the manager's email?",
  },
  {
    type: "input",
    name: "officeNumber",
    message: "What is the manager's office number?",
  },
];

// Continue adding employees question
const addMoreEmployees = {
  type: "list",
  choices: ["Yes", "No"],
  message: "Do you wish to add more employees?",
  name: "continue",
};

// General employee questions
const employeeQuestions = [
  {
    type: "list",
    choices: ["Intern", "Engineer"],
    name: "role",
    message: "What is the employee's role in the company?",
  },
  {
    type: "input",
    name: "name",
    message: "What is their name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is their id number?",
  },
  {
    type: "input",
    name: "email",
    message: "What is their email?",
  },
];

// Question specific to interns
const internQuestion = {
  type: "input",
  name: "school",
  message: "What school do they attend?",
};

// Question specific to engineers
const engineerQuestion = {
  type: "input",
  name: "github",
  message: "What is their github username?",
};

// Array containing all employees
const employees = [];

//Function Prompts user for information
async function promptQuestions() {
  try {
    // Ask questions about the manager
    const managerAnswers = await inquirer.prompt(managerQuestions);
    // Create a new object for the manager
    const theManager = new Manager(
      managerAnswers.name,
      managerAnswers.id,
      managerAnswers.email,
      managerAnswers.officeNumber
    );
    // Push the manager into the array of employees
    employees.push(theManager);

    // Used to stay in the while loop unti lthe user doesn't want to add anymore employees
    let continueAddingEmployees = "Yes";

    // Checks to see if the user wishes to add more employees
    const addMoreEmployeesAnswer = await inquirer.prompt(addMoreEmployees);
    continueAddingEmployees = addMoreEmployeesAnswer.continue;

    while (continueAddingEmployees === "Yes") {
      // Asks the the user general employee questions
      const employeeAnswers = await inquirer.prompt(employeeQuestions);

      //   Asks the user a question specific to interns
      if (employeeAnswers.role === "Intern") {
        const internAnswer = await inquirer.prompt(internQuestion);
        // Creates a new object for the intern added
        const newIntern = new Intern(
          employeeAnswers.name,
          employeeAnswers.id,
          employeeAnswers.email,
          internAnswer.school
        );
        // Push the intern into the array of employees
        employees.push(newIntern);
      }

      //   Asks the user a question specific to engineers
      if (employeeAnswers.role === "Engineer") {
        const engineerAnswer = await inquirer.prompt(engineerQuestion);
        // Creates a new object for the Engineer
        const newEngineer = new Engineer(
          employeeAnswers.name,
          employeeAnswers.id,
          employeeAnswers.email,
          engineerAnswer.github
        );

        // Pushes the engineer into the array of employees
        employees.push(newEngineer);
      }
      // Checks to see if the user wishes to add more employees
      const addMoreEmployeesAnswer = await inquirer.prompt(addMoreEmployees);
      continueAddingEmployees = addMoreEmployeesAnswer.continue;
    }

    // When the user is finished entering employees, renders a template for the html
    const templatedHTML = render(employees);

    // Checks to see if the output folder exists, if it doesn't a new directory is created
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    // writes the templated html to team.html in the output directory
    fs.writeFile(outputPath, templatedHTML, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// Calls the function to ask questions to the user to generate an html file
promptQuestions();
