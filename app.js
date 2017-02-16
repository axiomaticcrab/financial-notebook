var yargs = require('yargs');

const incomeModule = require('./modules/incomeModule');

yargs
    .command('createIncome', 'create an income for a mounth', {
        name: {
            demand: true,
            describe: 'the name of income',
            alias: 'n'
        },
        amount: {
            demand: true,
            describe: 'the amount of income in TL currency',
            alias: 'a'
        },
        date: {
            demand: true,
            describe: 'the date for income that belongs to. Must be in MM/YYYY format.',
            alias: 'd'
        }
    }, function (argv) {
        incomeModule.create(argv.amount,argv.date,argv.name);
    })
    .help();

yargs.
command('testMethod2', 'another method for testing.', {
    name: {
        describe: 'the name parameter.',
        alias: 'n',
        demand: false,
        default: 'tttt'
    }
}, function (argv) {
    console.log(argv.name);
}).help().argv;