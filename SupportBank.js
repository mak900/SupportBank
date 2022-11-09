const fs = require("fs");
const {parse} = require("csv-parse");
var readlineSync = require('readline-sync');
//var moment = require('moment');
//moment().format();

// Class
class Account {
    constructor(name) {
        this.name = name;
        this.amount = 0;
        // Array for transactions out of account
        this.out = [];
        // Array for transactions into account
        this.in = [];
    }
}
// Initialise object
let people = {};

// Reading csv file
stream = fs.createReadStream("./Transactions2014.csv");

stream = stream.pipe(parse({ delimiter: ",", from_line: 2 }));
stream.on('data', function (row) {
    // Obtain array of names from keys of object
    let names = Object.keys(people);
    // Add first person's account to object if not found
    if (names.includes(row[1]) == false) {
        people[row[1]] = new Account(row[1]);
    }
    // Add second person's account to object if not found
    if (names.includes(row[2]) == false) {
        people[row[2]] = new Account(row[2]);
    }
    // Update amounts for both accounts involved in transaction
    people[row[1]].amount -= parseFloat(row[4]);
    people[row[2]].amount += parseFloat(row[4]);
    // Update transaction lists for both accounts
    let indices = [0, 3, 4];
    people[row[2]].in.push(indices.map(x => row[x]));
    row[4] *= -1;
    people[row[1]].out.push(indices.map(x => row[x]));
});
// Actions after csv file is read
stream.on('end', function () {
    while (true) {
        // Ask user for prompt
        var response = readlineSync.question('Choose an option:\n');
        if (response == "List All") {
            // List all names and associated account values
            let list = Object.values(people);
            for (let i = 0; i < list.length; i++) {
                console.log(list[i].name + ": " + list[i].amount);
            }
        } else if (response.substring(0, 5) == "List ") {
            // Obtain name from input
            let name = response.substring(5);
            // Print all transactions in
            let list = people[name].in;
            for (let i = 0; i < list.length; i++) {
                console.log(list[i]);
            }
            // Print all transactions out
            list = people[name].out;
            for (let i = 0; i < list.length; i++) {
                console.log(list[i]);
            }
        }
    }
});


//moment("12/25/1995", "MM-DD-YYYY");