'use strict'

function train(trainDetails) {
  if(trainDetails != undefined && trainDetails != {}) {
    let from = trainDetails.from;
    let to = trainDetails.to;
    let date = trainDetails.date.split('/');
    let trainNumber = trainDetails.trainno;
    let pClass = trainDetails.pclass;
    let valideDate = parseInt(date[1]) + '-' + parseInt(date[0]) + '-' + parseInt(date[2]);

    if(document.getElementById('jpform:fromStation') && !document.getElementById('avlAndFareForm')) {
      document.getElementById('jpform:fromStation').value = from;
      document.getElementById('jpform:toStation').value = to;
      document.getElementById('jpform:journeyDateInputDate').value = valideDate;
      document.getElementById('jpform:jpsubmit').click();
    }

    if(document.getElementById('avlAndFareForm')) {
      document.getElementById('qcbd').querySelectorAll('input')[4].click();
      document.getElementById('cllink-' + trainNumber +'-'+ pClass + '-3').click();

      var interval = setInterval(function () {
        var bookNow = document.getElementById("" + trainNumber + "-" + pClass + "-TQ-0");
          if (bookNow != null) {
            clearInterval(interval);
            bookNow.click();
        }
        else if (!isBookNow) {
          clearInterval(interval);
        }
      }, 200);
    }

    if(document.getElementById('addPassengerForm')) {
      if(document.getElementsByClassName('psgn-name').length > 0){
        trainDetails.name.forEach(function(val, key) {
          document.getElementsByClassName('psgn-name')[key].value = val;
        });

        trainDetails.age.forEach(function(val, key) {
          document.getElementsByClassName('psgn-age')[key].value = val;
        });

        trainDetails.gender.forEach(function(val, key) {
          document.getElementsByClassName('psgn-gender')[key].value = val;
        });
        trainDetails.berth.forEach(function(val, key) {
          document.getElementsByClassName('psgn-berth-choice')[key].value = val;
        });

        trainDetails.childname.forEach(function(val, key) {
          document.getElementsByClassName('infant-name')[key].value = val;
        });
        trainDetails.childage.forEach(function(val, key) {
          document.getElementsByClassName('infant-age')[key].value = val;
        });
        trainDetails.childgender.forEach(function(val, key) {
          document.getElementsByClassName('infant-gender')[key].value = val;
        });

        if(CryptoJS.AES.decrypt(trainDetails.mobile, KEY).toString(CryptoJS.enc.Utf8).length == 10) {
          document.getElementsByClassName('mobile-number')[0].value = CryptoJS.AES.decrypt(trainDetails.mobile, KEY).toString(CryptoJS.enc.Utf8);
        }

        if(trainDetails.autoupgrade != undefined && trainDetails.autoupgrade == 1){
          document.getElementById('addPassengerForm:autoUpgrade').click();
        }
      
        let captchaText = document.getElementsByClassName('captcha-answer')[0];
        let image = $($('#addPassengerForm:irctcCaptchaPanel').find('img').context.images[0]);
        let refresh = $('img[alt="Refresh Captcha"]');

        let status = loadCaptcha(captchaText, image, refresh);
        $(".loginCaptcha").on("propertychange change keyup paste input", function(){
          if(captchaText.value.toUpperCase().length == 5) {
            setTimeout(function() {
              document.getElementById('validate').click();
            }, 2000);
          }else {
            captchaText.addEventListener('keyup', function() {
              if(captchaText.value.toUpperCase().length == 5) {
                setTimeout(function() {
                  document.getElementById('validate').click();
                }, 1000);
              }
            });
          }
        });
        if(status)
          $('.captcha-answer').trigger("change");
      }
    }

    bank(trainDetails);
  }
}
