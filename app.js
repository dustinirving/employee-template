// Importing modules

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

// Paths for creating a folder and a file
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// Questions for the manager
const managerQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is the manager's name?",
    validate(input) {
      if (input == false || !isNaN(input)) {
        input = "";
        return "You must enter a name";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "id",
    message: "What is the manager's id number?",
    validate(input) {
      if (input == false || isNaN(input)) {
        return "You must enter a number";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is the manager's email?",
    validate(input) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) === false) {
        return "You must enter a valid email address";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "officeNumber",
    message: "What is the manager's office number?",
    validate(input) {
      if (input == false || isNaN(input)) {
        return "You must enter a number";
      }
      return true;
    },
  },
];

// Continue adding employees question
const addMoreEmployeesQuestion = {
  type: "list",
  choices: ["Yes", "No"],
  message: "Do you wish to add more employees?",
  name: "yesOrNo",
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
    validate(input) {
      if (input == false || !isNaN(input)) {
        input = "";
        return "You must enter a name";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "id",
    message: "What is their id number?",
    validate(input) {
      if (input == false || isNaN(input)) {
        return "You must enter an id number";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is their email?",
    validate(input) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) === false) {
        return "You must enter a valid email address";
      }
      return true;
    },
  },
];

// Question specific to interns
const internQuestion = {
  type: "input",
  name: "school",
  message: "What school do they attend?",
  validate(input) {
    if (input == false) {
      return "You must enter a school";
    }
    return true;
  },
};

// Question specific to engineers
const engineerQuestion = {
  type: "input",
  name: "github",
  message: "What is their github username?",
  validate(input) {
    if (input == false) {
      return "You must enter a github username";
    }
    return true;
  },
};

// Array containing all employees
const employees = [];

promptQuestions().then(renderHTML).then(writeHTML);

//Function Prompts user for information
async function promptQuestions() {
  try {
    // Ask questions about the manager
    const managerAnswers = await inquirer.prompt(managerQuestions);
    // Destructures the object of user input
    const { name, id, email, officeNumber } = managerAnswers;
    // Creates a new object using the class definition
    const theManager = new Manager(name, id, email, officeNumber);
    // pushes the manager object into the array of employees
    employees.push(theManager);

    // Checks to see if the user wishes to add more employees
    const addMoreEmployeesAnswer = await inquirer.prompt(
      addMoreEmployeesQuestion
    );
    let continueAddingEmployees = addMoreEmployeesAnswer.yesOrNo;

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
      const addMoreEmployeesAnswer = await inquirer.prompt(
        addMoreEmployeesQuestion
      );
      continueAddingEmployees = addMoreEmployeesAnswer.yesOrNo;
    }
  } catch (err) {
    console.error(err);
  }
}

// When the user is finished entering employees, renders a template for the html
function renderHTML() {
  const templatedHTML = render(employees);
  return templatedHTML;
}

// When the HTML template is created, it is written to an HTML file
function writeHTML(templatedHTML) {
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
}
