var inputedMoney = 0;

$(document).ready(function () {
  loadVendingMachineItems();

  $('#add-dollar-button').on('click', function () {
    inputedMoney += 1;
    messageBox('Dollar added');
    updateMoneyBox(inputedMoney);
  });

  $('#add-quarter-button').on('click', function () {
    inputedMoney += 0.25;
    messageBox('Quarter added');
    updateMoneyBox(inputedMoney);
  });

  $('#add-dime-button').on('click', function () {
    inputedMoney += 0.1;
    messageBox('Dime added');
    updateMoneyBox(inputedMoney);
  });

  $('#add-nickel-button').on('click', function () {
    inputedMoney += 0.05;
    messageBox('Nickel added');
    updateMoneyBox(inputedMoney);
  });

  $('.make-purchase').click(function () {
    makePurchase();
  });

  $('#return-change').on('click', function () {
    returnChange();
  });
}); //end ready-function

function loadVendingMachineItems() {
  var vendingItems = $('#vend_items');

  $.ajax({
    type: 'GET',
    url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
    success: function (vendingItemsArray) {
      vendingItems.empty();

      $.each(vendingItemsArray, function (index, item) {
        var id = item.id;
        var name = item.name;
        var price = item.price;
        var quantity = item.quantity;
        // console.log(id);
        // console.log(name);

        var vendingItemDetails = `<button type="button" class=" btn-vendingItems" role="button" id=${id} name=${name}>`;
        vendingItemDetails += '<p class="itemID">' + id + '</p>';
        vendingItemDetails += '<p>' + name + '</p>';
        vendingItemDetails += '<p>$' + price.toFixed(2) + '</p>';
        vendingItemDetails += '<p> Quantity Left: ' + quantity + '</p>';
        vendingItemDetails += '</button>';
        vendingItems.append(vendingItemDetails);
        document
          .getElementById(id)
          .addEventListener('click', () => selectItem(id, name));
      });
    },
    error: function () {
      alert('Failure Calling Web Service - Please try again later.');
    },
  });
}

function selectItem(id, name) {
  $('#item-to-vend').val(id + ': ' + name);
}

function messageBox(message) {
  $('#vending-message').val(message);
}

function updateMoneyBox(money) {
  $('#money-input').empty();
  $('#money-input').val(money.toFixed(2));
}

function makePurchase() {
  var money = $('#money-input').val();
  var item = $('#item-to-vend').val();
  var itemID = item.split(':')[0];

  if (money == 0) {
    messageBox('Please insert money');
  } else if (item == '') {
    messageBox('Please make a selection');
  } else {
    $.ajax({
      type: 'POST',
      url: `http://vending.us-east-1.elasticbeanstalk.com/money/${money}/item/${itemID}`,
      success: function (returnMoney) {
        console.log(returnMoney);
        var change = $('#change-input-box');
        $('#vending-message').val('Item purchased!');
        var pennies = returnMoney.pennies;
        var nickels = returnMoney.nickels;
        var quarters = returnMoney.quarters;
        var dimes = returnMoney.dimes;
        var returnMessage = '';

        if (quarters != 0) {
          returnMessage += quarters + ' Quarter/s';
        }
        if (dimes != 0) {
          returnMessage += dimes + ' dime/s';
        }
        if (nickels != 0) {
          returnMessage += nickels + ' nickel/s';
        }
        if (pennies != 0) {
          returnMessage += pennies + ' pennie/s';
        }
        if (quarters == 0 && dimes == 0 && nickels == 0 && pennies == 0) {
          returnMessage += 'No change due.';
        }

        change.val(returnMessage);
        $('#money-input').val('');
        loadVendingMachineItems();
        inputedMoney = 0;
      },
      error: function (error) {
        var errorMessage = error.responseJSON.message;
        messageBox(errorMessage);
      },
    });
  }
} //end makePurchase

function returnChange() {
  var inputMoney = $('#money-input').val();
  var money = $('#money-input').val();

  var quarter = Math.floor(money / 0.25);
  money = (money - quarter * 0.25).toFixed(2);
  var dime = Math.floor(money / 0.1);
  money = (money - dime * 0.1).toFixed(2);
  var nickel = Math.floor(money / 0.05);
  money = (money - nickel * 0.05).toFixed(2);
  var penny = Math.floor(money / 0.01);
  money = (money - penny * 0.01).toFixed(2);

  var returnMessage = '';
  var vendingMessage = '';

  if (quarter != 0) {
    returnMessage += qaurter + ' Quarter(s)';
  }

  if (dime != 0) {
    returnMessage += dime + ' Dime(s)';
  }

  if (nickel != 0) {
    returnMessage += nickel + ' Nickel(s)';
  }

  if (penny != 0) {
    returnMessage += penny + ' Penny(ies)';
  }

  if (quarter == 0 && dime == 0 && nickel == 0 && penny == 0) {
    returnMessage += 'There is no change.';
    vendingMessage = 'No money was entered';
  } else {
    vendingMessage =
      'Transaction stopped. Money entered: $' +
      inputMoney +
      ' returned as change.';
  }

  inputedMOney = 0;
  messageBox('');
  $('#vendingMessage').val(vendingMessage);
  $('#change-input-box').val(returnMessage);
  $('#item-to-vend').val('');
  $('#money-input').val('');
}
