'use strict'

function bank(bankDetails) {
  if(document.getElementById('jpBook')){
    if(bankDetails != undefined && bankDetails != {}) {
      if(bankDetails.payType != "" && bankDetails.payType != undefined) {

        switch (bankDetails.payType) {
            case "NETBANKING":
              if(bankDetails.bankData.bankName != undefined && bankDetails.bankData.bankName != "") {
                document.querySelector('input[name="NETBANKING"][value="'+bankDetails.bankData.bankName+'"]').click();
                setTimeout(function(){
                  document.getElementById('validate').click();
                }, 2000);
              }
            break;
            case "CREDIT_CARD":
              document.getElementById(bankDetails.payType).click();
              document.querySelector('input[name="CREDIT_CARD"][value="' + bankDetails.bankData.bankName + '"]').click();
              let expiry = CryptoJS.AES.decrypt(bankDetails.bankData.expiry, KEY).toString(CryptoJS.enc.Utf8).split('/');
              document.getElementById('card_no_id').value = CryptoJS.AES.decrypt(bankDetails.bankData.cardNumber, KEY).toString(CryptoJS.enc.Utf8).replace(/ /g,'');
              document.getElementById('card_expiry_year_id').value = expiry[1].toString().trim();
              document.getElementById('card_expiry_mon_id').value = expiry[0].toString().trim();
              document.getElementById('cvv_no_id').value = CryptoJS.AES.decrypt(bankDetails.bankData.cvv, KEY).toString(CryptoJS.enc.Utf8);
              document.getElementById('card_name_id').value = bankDetails.bankData.cardName;

              break;
            default:
              console.log('');

        }
      }
    }
  }
}
