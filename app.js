const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Array of objects of questions to ask the user
const employeeQuestions = [
  {
    type: "list",
    choices: ["Intern", "Engineer", "Manager"],
    name: "role",
    message: "What is their role in the company?",
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
    message: "What is their email",
  },
];

const internQuestion = {
  type: "input",
  name: "school",
  message: "What school do they attend?",
};

const engineerQuestion = {
  type: "input",
  name: "github",
  message: "What is their github username?",
};

const managerQuestion = {
  type: "input",
  name: "officeNumber",
  message: "What is their office number?",
};

//Function Prompts user for information
async function promptQuestions() {
  try {
    const employeeAnswers = await inquirer.prompt(employeeQuestions);
    if (employeeAnswers.role === "Intern") {
      inquirer.prompt(internQuestion);
    }
    if (employeeAnswers.role === "Engineer") {
      inquirer.prompt(engineerQuestion);
    }
    if (employeeAnswers.role === "Manager") {
      inquirer.prompt(managerQuestion);
    }
  } catch (err) {
    console.error(err);
  }
}

promptQuestions();
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
