const key = "25442A472D4B614E645267556B58703273357638792F423F4528482B4D6251655368566D597133743677397A24432646294A404E635266556A576E5A72347537";
let ticket = {
    "from": '',
    "to": '',
    "date": '',
    "trainno": '',
    "pclass": '',
    "quota": '',
    "boardingstation": '',
    "name": '',
    "age": '',
    "gender": '',
    "berth": '',
    "meal": '',
    "childname": '',
    "childage": '',
    "childgender": '',
    "mobile": '',
    "autoupgrade": '',
    "confirmseats": '',
    "preferredcoachno": '',
    "special": '',
    "payType": "",
    "bankData": ""
};
let names = [];
let age = [];
let gender = [];
let berth = [];
let meal = [];
let childnames = [];
let childages = [];
let childgenders = [];
let login = {
    "username": '',
    "password": ''
};

let aadhaar = [];
let concession = [];

$(document).ready(function(){
    let date_input=$('input[name="date"]'); //our date input has the name "date"
    let container=$('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    let options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);

    $('.js-typeahead-station').autocomplete({
        source: stations
    });

    function selectPayData(val) {

      $('#control-label').show();
      $('#card').hide();
      let types = ["NETBANKING", "CREDIT_CARD", "DEBIT_CARD", "CASH_CARD", "EMI"];
      for (let type in types) {
          document.getElementsByClassName(types[type])[0].style.display = "none";
      }
      if(val == "SKIP") {
        $('#control-label').hide();
      }else {
        document.getElementsByClassName(val)[0].style.display = "block";
      }

      if(val == 'DEBIT_CARD' || val == "CREDIT_CARD"){
        $('#card').show();
      }
    }

    $('[data-numeric]').payment('restrictNumeric');
    $('#cardNumber').payment('formatCardNumber');
    $('#expiryMonth').payment('formatCardExpiry');
    $('#cvv').payment('formatCardCVC');

    $('input[type=radio][name=bank]').change(function() {
      selectPayData(this.value);
   });

   chrome.storage.sync.get('ticketDetails', function(response) {
     if(response.ticketDetails != undefined && response.ticketDetails != {}){
       let data = response.ticketDetails;
        $('#username').val(toString(CryptoJS.AES.decrypt(data.login.username, key)));
        $('#password').val(toString(CryptoJS.AES.decrypt(data.login.password, key)));

        $('#from').val(data.from);
        $('#to').val(data.to);
        $('#date').val(data.date);
        $('#trainNumber').val(data.trainno);
        $('#class').val(data.pclass);
        $('#quota').val(data.quota);

        console.log(data);

        if(data.name != undefined && data.name.length > 0){
          let count = 0;
          data.name.forEach(function() {
            $('.u-name').eq(count).val(data.name[count]);
            $('.u-age').eq(count).val(data.age[count]);
            $('.u-gender').eq(count).val(data.gender[count]);
            $('.u-berth').eq(count).val(data.berth[count]);
            $('.u-meal').eq(count).val(data.meal[count]);
            count++;
          });
        }

        if(data.childname != undefined && data.childname.length > 0){
          let count = 0;
          data.childname.forEach(function() {
            $('.c-name').eq(count).val(data.childname[count]);
            $('.c-age').eq(count).val(data.childage[count]);
            $('.c-gender').eq(count).val(data.childgender[count]);
          });
        }
        $('.u-mobile').val(toString(CryptoJS.AES.decrypt(data.mobile, key)));
        $('.u-boardingStation').val(data.boardingstation);
        if(data.autoupgrade == 1) {
          $('#autoUpgrade').prop('checked', true);
        }
        if(data.confirmseats == 1){
          $('#confirmseats').prop('checked', true);
        }
        if(data.special != undefined && data.special > 2) {
          $('input[name=condition][value='+data.special+']').prop('checked', true);
        }

        if(data.payType != undefined && data.payType != "") {
          $('input[name=bank][value='+data.payType+']').prop('checked', true);
          selectPayData(data.payType);

          if(data.bankData != undefined && data.bankData != '') {
            $('.'+data.payType).eq(0).val(data.bankData.bankName);
          }

          if((data.payType == "CREDIT_CARD" || data.payType == "DEBIT_CARD") && (data.bankData != undefined && data.bankData != "")) {
              $('#cardNumber').val(CryptoJS.AES.decrypt(data.bankData.cardNumber, key).toString(CryptoJS.enc.Utf8));
              $('#expiryMonth').val(toString(CryptoJS.AES.decrypt(data.bankData.expiry, key)));
              $('#cvv').val(toString(CryptoJS.AES.decrypt(data.bankData.cvv, key)));
              $('#cardName').val(data.bankData.cardName);
              $('.cc-brand').text(toString(CryptoJS.AES.decrypt(data.bankData.cardNumber, key)));
              alert(CryptoJS.AES.decrypt(data.bankData.cardNumber, key).toString(CryptoJS.enc.Utf8).replace(/ /g,''));
          }
        }
     }
   });

});

function toString(string) {
    return string.toString(CryptoJS.enc.Utf8);
}

$('#save-btn').click(function() {
    let loginStatus, tripStatus, userStatus, bankStatus = false;
    $('#login-error').hide();
    $('#trip-error').hide();
    $('#user-error').hide();

    loginStatus = validateLogin();

    if(loginStatus && loginStatus != undefined)
        tripStatus = validateTrip();
    else
        return false;

    if(tripStatus && tripStatus != undefined)
        userStatus = validateUser();
    else
        return false;

    if(userStatus && userStatus != undefined)
        bankStatus = validateBank();
    else
        return false;

    if(bankStatus) {
      ticket.login = login;
      chrome.storage.sync.set({'ticketDetails': ticket}, function() {
        alert('Ticket Details Saved.');
        location.reload();
      });
    }
});


function validateBank() {
  ticket.payType = "";
  ticket.payType = $('input[name=\'bank\']:checked').val();
  let hasBankError = false;
  if(ticket.payType == "CREDIT_CARD" || ticket.payType == "DEBIT_CARD") {
    if(!$.payment.validateCardNumber($('#cardNumber').val())){
      $('#cardNumber').css('border', '1px solid rgb(247, 54, 11)');
      hasBankError = true;
    }
    if(!$.payment.validateCardExpiry($('#expiryMonth').payment('cardExpiryVal'))){
      $('#expiryMonth').css('border', '1px solid rgb(247, 54, 11)');
      hasBankError = true;
    }
    let cardType = $.payment.cardType($('#cardNumber').val());
    if(!$.payment.validateCardCVC($('#cvv').val(), cardType)){
      $('#cvv').css('border', '1px solid rgb(247, 54, 11)');
      hasBankError = true;
    }

    if($('#cardName').val() == undefined || $('#cardName').val() == ""){
      $('#cardName').css('border', '1px solid rgb(247, 54, 11)');
      hasBankError = true;
    }
    if(hasBankError)
      return false;

    $('.cc-brand').text(cardType);
  }

  if(ticket.payType && ticket.payType != "SKIP"){
    let bankData = {};
    bankData.bankName = $('.'+ticket.payType).eq(0).val();
    if(ticket.payType == "CREDIT_CARD" || ticket.payType == "DEBIT_CARD") {
      bankData.cardNumber = CryptoJS.AES.encrypt($('#cardNumber').val(), key);
      bankData.expiry = CryptoJS.AES.encrypt($('#expiryMonth').val(), key);
      bankData.cvv = CryptoJS.AES.encrypt($('#cvv').val(), key);
      bankData.cardName = $('#cardName').val();
    }
    ticket.bankData = bankData;
  }else {
    ticket.bankData = {};
  }

  return true;
}

function validateLogin() {
    let username = $('#username').val();
    let password = $('#password').val();

    if(username == '' || password == '') {
        $('#login-error').show();
        return false;
    }

    username = CryptoJS.AES.encrypt(username, key).toString();
    password = CryptoJS.AES.encrypt(password, key).toString();;

    login.username = username;
    login.password = password;

    return true;
}

function validateTrip() {
    let from = $('#from').val();
    let to = $('#to').val();
    let date = $('#date').val();
    let trainNumber = $('#trainNumber').val();
    let pClass = $('#class').val();
    let quota = $('#quota').val();

    if(from == '' || to == '' || date == '' || trainNumber == '' || pClass == '' || quota == '') {
        $('#trip-error').show();
        return false;
    }
    let tId = parseInt(localStorage['ticketid']) + 1;
    ticket.id = isNaN(tId) ? 1 : iId;
    ticket.from = from;
    ticket.to = to;
    ticket.date = date;
    ticket.pclass = pClass;
    ticket.trainno = trainNumber;
    ticket.quota = quota;

    return true;
}

function validateUser(){

    names = [];
    age = [];
    gender = [];
    berth = [];
    meal = [];
    childnames = [];
    childages = [];
    childgenders = [];
    aadhaar = [];
    concession = [];

    let hasError = 0;
    let count = 0;
    $('.p-error').hide();
    $('.u-name').each(function() {
        count++;
        if(count == 1) {
            if($(this).val() == ''){
                $(this).css('border', '1px solid rgb(247, 54, 11)');
                hasError = 1;
            }else {
                if($('.u-name').val().toString().length < 3 || $('.u-name').val().toString().length > 16) {
                    $('.p-error').html('Name should be between 3 and 16 characters.');
                    $('.p-error').show();
                    hasError = 1;
                }else {
                    if($('.u-age').eq(0).val() == ''){
                        $('.u-age').eq(0).css('border', '1px solid rgb(247, 54, 11)');
                        hasError = 1;
                    }else {
                        if($('.u-gender').eq(0).val() == ' ') {
                            $('.u-gender').eq(0).css('border', '1px solid rgb(247, 54, 11)');
                            hasError = 1;
                        }
                    }
                }
            }
        }else {
            if($(this).val().length > 0) {
                if($('.u-age').eq(count - 1).val() == '') {
                    $('.u-age').eq(count - 1).css('border', '1px solid rgb(247, 54, 11)');
                    hasError = 1;
                };

                if($('.u-gender').eq(count - 1).val() == ' ') {
                    $('.u-gender').eq(count - 1).css('border', '1px solid rgb(247, 54, 11)');
                    hasError = 1;
                }
            }
        }
    });

    let childCount = 0;
    $('.c-name').each(function() {
        childCount++;
        if($(this).val().length > 0) {
            if($('.c-age').eq(childCount - 1).val() == '') {
                $('.c-age').eq(childCount - 1).css('border', '1px solid rgb(247, 54, 11)');
                hasError = 1;
            };

            if($('.c-gender').eq(childCount - 1).val() == '') {
                $('.c-gender').eq(childCount - 1).css('border', '1px solid rgb(247, 54, 11)');
                hasError = 1;
            }
        }

    });


    if($('.u-mobile').val().length != 10) {
        $('.u-mobile').css('border', '1px solid rgb(247, 54, 11)');
        hasError = 1;
    }

    if($('#boardingStation').val().length > 0){
        ticket.boardingstation = $('#boardingStation').val();
    }

    if($('#autoUpgrade').is(':checked')) {
        ticket.autoupgrade = 1;
    }

    if($('#confirmseats').is(':checked')){
        ticket.confirmseats = 1;
    }

    ticket.special = $('input[name=\'condition\']:checked').val();

    if(hasError == 0) {
        $('.u-name').each(function(){
            if($(this).val().length > 0 ) {
                names.push($(this).val());
                age.push($(this).parent().next().find('input').val());
                gender.push($(this).parent().next().next().find('select').val());
                berth.push($(this).parent().next().next().next().find('select').val());
                meal.push($(this).parent().next().next().next().next().find('select').val());
                concession.push($(this).parent().next().next().next().next().next().find($('.u-concession')).is(':checked'));
                aadhaar.push($(this).parent().next().next().next().next().next().next().find('input').val());
            }
        });

        ticket.name = names;
        ticket.age = age;
        ticket.gender = gender;
        ticket.berth = berth;
        ticket.meal = meal;
        ticket.concession = concession;
        ticket.aadhaar = aadhaar;

        $('.c-name').each(function(){
            if($(this).val().length > 0) {
              childnames.push($(this).val());
              childages.push($(this).parent().next().find('select').val());
              childgenders.push($(this).parent().next().next().find('select').val());
            }
        });

        ticket.childname = childnames;
        ticket.childage = childages;
        ticket.childgender = childgenders;
        ticket.mobile = CryptoJS.AES.encrypt($('.u-mobile').val(), key).toString();

        return true;
    }else {
      return false;
    }
}

$('#reset-btn').click(function() {
  Clean();
});

function Clean() {
    chrome.storage.sync.remove('ticketDetails', function() {
      alert("Cleared.");
      location.reload();
    });
}
