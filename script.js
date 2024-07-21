'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = (movements, sorted = false) => {
  containerMovements.innerHTML = '';
  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${move}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

// displayMovements(account1.movements);

const createUserName = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);
console.log(accounts);

const euroToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * euroToUsd);

// const deposit = movements.filter(move => move > 0);
// console.log(deposit);

// const withdrawal = movements.filter(move => move < 0);
// console.log(withdrawal);

const calcPrintBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = acc => {
  const moneyIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${moneyIn}€`;

  const moneyOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${-moneyOut}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((cal, now) => cal + now, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(movements)

const update = acc => {
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
  displayMovements(acc.movements);
};

let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
  }
  else{
    alert('Wrong user or pin');
  }
  update(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // Get the transfer amount and receiver account
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear the input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  // Log the values for debugging
  console.log('Amount:', amount);
  console.log('Receiver Account:', receiverAcc);
  console.log('Current Account:', currentAccount);

  // Error handling for various transfer conditions
  if (!receiverAcc) {
    alert('Receiver account not found!');
  } else if (amount <= 0) {
    alert('Transfer amount must be greater than zero.');
  } else if (currentAccount.balance < amount) {
    alert('Insufficient balance.');
  } else if (receiverAcc.username === currentAccount.username) {
    alert('Cannot transfer to the same account.');
  } else {
    // Perform the transfer if all conditions are met
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    update(currentAccount);
    console.log('Transfer Successful');
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    console.log('Delete Account');
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && accounts.movements.some(mov => mov >= mov * 0.1)) {
    currentAccount.movements.push(amount);
    update(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = true;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});
