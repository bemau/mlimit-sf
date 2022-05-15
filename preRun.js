const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs')
let i = 0;

const appFiles = [
    './force-app/main/default/flows/Measure_Config.flow-meta.xml',
    './force-app/main/default/remoteSiteSettings/mlimitcore.remoteSite-meta.xml',
    './force-app/main/default/connectedApps/mlimit.connectedApp-meta.xml',
    './force-app/main/default/namedCredentials/mlimitcore.namedCredential-meta.xml'
];

const userFiles = [
    './force-app/main/default/reports/MLimit.reportFolder-meta.xml'
]

// returns a promise which resolves true if file exists:
let checkFileExists = s => new Promise(r=>fs.access(s, fs.constants.F_OK, e => r(!e)))


process.argv.forEach(function (val, index, array) {
    if (val == '--app') {
        const name = process.argv[index+1];
        if (name === undefined) {
             console.log('You have missed the App Name');
             return;
        }
        console.log(`${name}, is your Heroku App Name`);
        appFiles.forEach((file, key, arr) => {
            console.log(`Reading file at index ${key} with value ${file}`);
            checkFileExists(file)
                .then(
                        bool => {
                            console.log(`File ${file} exists: ${bool}`);
                            if(bool) {
                                fs.readFile(file, 'utf8', function (err,data) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    appName = `https://${name}`;
                                    const result = data.replace(/https:\/\/herokuapp.com/g, appName);
                                    
                                    fs.writeFile(file, result, 'utf8', function (err) {
                                        if (err) return console.log(err);
                                        console.log(`File ${file} changed`);
                                        return rl.close();
                                    });
                                    
                                    });
                            }
                        }
                    )
                .catch(function (err) {
                    console.log(err);
                })
        })
    }
    if (val == '--user') {
        const name = process.argv[index+1];
        if (name === undefined) {
             console.log('You have missed the Username');
             return;
        }
        console.log(`${name}, is your Username`);
        userFiles.forEach((file, key, arr) => {
            console.log(`Reading file at index ${key} with value ${file}`);
            checkFileExists(file)
                .then(
                        bool => {
                            console.log(`File ${file} exists: ${bool}`);
                            if(bool) {
                                fs.readFile(file, 'utf8', function (err,data) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    const result = data.replace(/DEFAULTUSERNAME/g, name);
                                    
                                    fs.writeFile(file, result, 'utf8', function (err) {
                                        if (err) return console.log(err);
                                        console.log(`File ${file} changed`);
                                        return rl.close();
                                    });
                                    
                                    });
                            }
                        }
                    )
                .catch(function (err) {
                    console.log(err);
                })
        })
    }
    if (val == '--help') {
        console.log('Usage: node [options]');
        console.log('Options:\n--app name\t\tadd your Heroku App Name (e.g. --app mlimit.herokuapp.com)');
    }
  });

// process.exit();

