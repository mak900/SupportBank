const fs = require("fs");
const {parse} = require("csv-parse");
var readlineSync = require('readline-sync');
//var moment = require('moment');
//moment().format();

class Account {
    constructor(name) {
        this.name = name;
        this.amount = 0;
        this.out = [];
        this.in = [];
    }
}
let people = {};

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
    people[row[1]].amount -= parseFloat(row[4]);
    people[row[2]].amount += parseFloat(row[4]);
    let indices = [0, 3, 4];
    people[row[2]].out.push(indices.map(x => row[x]));
    row[4] *= -1;
    people[row[1]].out.push(indices.map(x => row[x]));
});

stream.on('end', function () {
    while (true) {
        var response = readlineSync.question('Choose an option:\n');
        if (response == "List All") {
            let list = Object.values(people);
            for (let i = 0; i < list.length; i++) {
                console.log(list[i].name + ": " + list[i].amount);
            }
        } else if (response == "List" + "a") {
            console.log("A");
        }
    }
});


//moment("12/25/1995", "MM-DD-YYYY");