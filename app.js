console.log("Starting password manager...");
var crypto = require('crypto-js');

var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
  .command('create', 'creates an account', function(yargs) {
      yargs.options({
        name: {
          demand: true,
          alias: 'n',
          description: "User's account name",
          type: 'string'
        },
        username: {
          demand: true,
          alias: 'u',
          description: 'Users account username',
          type: 'string'
        },
        password: {
          demand: true,
          alias: 'p',
          description: 'Users account password',
          type: 'string'
        },
        masterpassword: {
          demand: true,
          alias: 'm',
          description: 'Master password for account',
          type: 'string'
        }
      }).help('help');
  })
  .command('get', 'Gets user account by name', function(yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: 'n',
        description: 'Users account name',
        type: 'string'
      },
      masterpassword: {
          demand: true,
          alias: 'm',
          description: 'Master password for account',
          type: 'string'
        }
    }).help('help');
  })
  .help('help')
  .argv;

var command = argv._[0];

function getAccounts(masterpassword) {
  var encryptedAccounts = storage.getItemSync('accounts');
  var accounts = [];
  
  if(typeof encryptedAccounts !== 'undefined') {
    var bytes = crypto.AES.decrypt(encryptedAccounts, masterpassword);
    accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
  }
  

  return accounts;
}

function saveAccounts(accounts, masterpassword) {
  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterpassword);

  storage.setItemSync('accounts', encryptedAccounts.toString());

  return accounts;

}

function createAccount(account, masterpassword) {
  var accounts = getAccounts(masterpassword);

  accounts.push(account);

  saveAccounts(accounts, masterpassword); 
  

  return account;
}

function getAccount(accountName, masterpassword) {
  var accounts = getAccounts(masterpassword);
  var matchedAccount;

  accounts.forEach(function(account) {
    if(account.name === accountName) {
      matchedAccount = account;
    }
    
  });

  return matchedAccount;
}

if(command === 'create') {
  var createdAccount = createAccount({
    name: argv.name,
    username: argv.username,
    password: argv.password
  }, argv.masterpassword);

  console.log('Account successfully created!');
  console.log(createdAccount);
}

else if(command === 'get') {
  var fetchedAccount = getAccount(argv.name, argv.masterpassword);

  if (typeof fetchedAccount === 'undefined') {
    console.log('Account not found!');
  }
  else {
    console.log('Account found!');
    console.log(fetchedAccount);
  }
}
