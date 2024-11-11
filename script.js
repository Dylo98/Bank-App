'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Dawid Dyl',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 120],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-27T17:01:17.194Z',
    '2024-11-06T23:36:17.929Z',
    '2024-11-10T10:51:36.790Z',
    '2024-11-11T10:51:36.790Z',
  ],
  currency: 'PLN',
  locale: 'pl-PL', // de-DE
};

const account2 = {
  owner: 'Kinga Kordzikowska',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 1200, 300],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
    '2024-11-03T12:01:20.894Z',
    '2024-11-09T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

// Variables

let currentAccount;

//Functions

const displayMovmentsDates = function (data, value) {
  const calcDaysPassed = function (data1, data2) {
    return Math.round(Math.abs(data1 - data2) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(new Date(), data);
  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(value).format(data);
  }
};

const displayCurrency = function (locale, currency, value) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc) {
  const movs = acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const currencyMov = displayCurrency(acc.locale, acc.currency, mov);

    const date = new Date(acc.movementsDates[i]);
    const displayMovData = displayMovmentsDates(date, acc.locale);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayMovData}</div>
          <div class="movements__value">${currencyMov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = displayCurrency(acc.locale, acc.currency, balance);
};

const displaySummary = function (acc) {
  // In movements
  const sumIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = displayCurrency(acc.locale, acc.currency, sumIn);

  // Out movements
  const sumOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = displayCurrency(
    acc.locale,
    acc.currency,
    Math.abs(sumOut)
  );

  // Interest movements
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = displayCurrency(
    acc.locale,
    acc.currency,
    interest
  );
};

const createUsernames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(acc => acc[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};

const clearInput = function () {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
};

///////////////////
// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
///////////////

// Events

///////////////////
// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
///////////////

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    const greetingName = currentAccount.owner.split(' ')[0];
    labelWelcome.textContent = `Welcome ${greetingName}`;
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    clearInput();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const balance = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log('ok');
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    clearInput();
    updateUI(currentAccount);
  }
});
