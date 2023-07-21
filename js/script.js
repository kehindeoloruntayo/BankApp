// Business Logic for BankAccount
function BankAccount(name, accountNumber) {
  this.name = name;
  this.accountNumber = accountNumber;
  this.balance = 0;
}

BankAccount.prototype.deposit = function(amount) {
  this.balance += amount;
  addTransaction(this.name, this.accountNumber, 'Deposit', amount);
};

BankAccount.prototype.withdraw = function(amount) {
  if (amount <= this.balance) {
    this.balance -= amount;
    addTransaction(this.name, this.accountNumber, 'Withdrawal', amount);
    return true;
  }
  return false;
};

BankAccount.prototype.getBalance = function() {
  return this.balance;
};

// Transaction History
const transactions = [];

function addTransaction(name, accountNumber, type, amount) {
  transactions.push({ name, accountNumber, type, amount });
}

// User Interface Logic
let bankAccounts = [];

function displayAccountDetails(account) {
  $("#accountDetails .name").text(account.name);
  $("#accountDetails .accountNumber").text(account.accountNumber);
  $("#accountDetails .balance").text('$' + account.getBalance().toFixed(2));
  $("#accountDetails").show();
}

function displayTransactionHistory() {
  let transactionList = $("#transactions");
  transactionList.empty();
  transactions.forEach(function(transaction) {
    transactionList.append(`<li>${transaction.name} (${transaction.accountNumber}): ${transaction.type} $${transaction.amount.toFixed(2)}</li>`);
  });
  $("#transactionHistory").show();
}

function displayTransactionDetails(transaction) {
  $("#transactionDetails .name").text(transaction.name);
  $("#transactionDetails .accountNumber").text(transaction.accountNumber);
  $("#transactionDetails .type").text(transaction.type);
  $("#transactionDetails .amount").text('$' + transaction.amount.toFixed(2));
  $("#transactionDetails").show();
}

function attachTransactionClickEvent() {
  $("#transactions").on("click", "li", function() {
    const transactionIndex = $(this).index();
    const transaction = transactions[transactionIndex];
    displayTransactionDetails(transaction);
  });
}

function displayInsufficientFundsMessage() {
  $("#insufficientFundsMessage").show();
}

function getSelectedAccount(accountNumber) {
  return bankAccounts.find(account => account.accountNumber === accountNumber);
}

$(document).ready(function() {
  $("form#bankForm").submit(function(event) {
    event.preventDefault();
    const name = $("#name").val();
    const accountNumber = $("#accountNumber").val();
    const transactionType = $("#transactionType").val();
    const amount = parseFloat($("#amount").val());

    let selectedAccount = getSelectedAccount(accountNumber);

    if (!selectedAccount) {
      selectedAccount = new BankAccount(name, accountNumber);
      bankAccounts.push(selectedAccount);
    }

    if (transactionType === 'deposit') {
      selectedAccount.deposit(amount);
    } else {
      const isWithdrawalSuccessful = selectedAccount.withdraw(amount);
      if (!isWithdrawalSuccessful) {
        displayInsufficientFundsMessage();
        return;
      }
    }

    displayAccountDetails(selectedAccount);
    displayTransactionHistory();
    attachTransactionClickEvent();

    // Clear input fields after transaction
    $("#name").val("");
    $("#accountNumber").val("");
    $("#amount").val("");
  });
});