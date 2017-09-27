'use strict'

const KEY = "25442A472D4B614E645267556B58703273357638792F423F4528482B4D6251655368566D597133743677397A24432646294A404E635266556A576E5A72347537";
let loginDetalis = {};
let dataStatus = false;

function getTicketdata() {
  chrome.storage.sync.get('ticketDetails', function(details) {
    loginDetalis = details.ticketDetails;

    dataStatus = true;
    login();
  });
}

function login() {
  if(loginDetalis != undefined && loginDetalis != {}) {
    let loginCredentials = loginDetalis.login;
    if(document.getElementById('usernameId') && document.getElementsByClassName('loginPassword')) {
      setTimeout(function() {
        document.getElementById('usernameId').value = CryptoJS.AES.decrypt(loginCredentials.username, KEY).toString(CryptoJS.enc.Utf8);
        document.getElementsByClassName('loginPassword')[0].value = CryptoJS.AES.decrypt(loginCredentials.password, KEY).toString(CryptoJS.enc.Utf8);
        document.getElementsByName('j_captcha')[0].focus();

        let captchaText = document.getElementsByName('j_captcha')[0];
        if(document.getElementById("refresh")) {
          let status = loadCaptcha(captchaText, document.getElementById('cimage'), document.getElementById("refresh"));
          $(".loginCaptcha").on("propertychange change keyup paste input", function(){
              if(status && captchaText.value.toUpperCase().length == 5) {
                setTimeout(function() {
                  //document.getElementById('loginbutton').click();
                }, 3000);
              }else {
                captchaText.addEventListener('keyup', function() {
                  if(captchaText.value.toUpperCase().length == 5) {
                    setTimeout(function() {
                      document.getElementById('loginbutton').click();
                    }, 1000);
                  }
                });
              }
          });
          if(status)
            $('.loginCaptcha').trigger("change");
        }
      });
    }
  }

  train(loginDetalis);
}

setTimeout(function() {
  if(dataStatus == false){
    getTicketdata();
  }else{
    login();
  }
}, 200);
