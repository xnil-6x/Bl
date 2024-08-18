function showMessage(message, isError = false) {
  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = `<div class="${isError ? 'error' : ''}">${message}</div>`;
  const separator = document.createElement('div');
  separator.classList.add('separator');
  responseDiv.appendChild(separator);

  const developerDiv = document.createElement('div');
  developerDiv.classList.add('developer');
  developerDiv.innerHTML = 'Developer: <a href="https://www.facebook.com/Alifhosson.xxx?mibextid=ZbWKwL">Alif Hosson</a>';
  responseDiv.appendChild(developerDiv);
}

document.getElementById('checkForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var phoneNumber = document.getElementById('phoneNumber').value;
  var overlay = document.getElementById('overlay');

  if (!/^019/.test(phoneNumber)) {
      showMessage('ত্রুটি: এটি বাংলালিংক নম্বর নয়।', true);
      return;
  }

  var apiUrl = "https://myblapi.banglalink.net/api/v1/emergency-balance/" + encodeURIComponent(phoneNumber);

  overlay.classList.remove('hidden');

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
      overlay.classList.add('hidden');
      if (data.status === "SUCCESS") {
          const loanInfo = data.data;

          if (loanInfo.id === undefined || loanInfo.msisdn === undefined || loanInfo.due_loan === undefined || loanInfo.expires_in === undefined) {
              showMessage('Not:এই নাম্বারে লোন নেওয়া হয়নি।💰', true);
          } else {
              const infoHtml = `
                  <div class="row">
                      <div class="col label">আইডি:</div>
                      <div class="col">${loanInfo.id}</div>
                  </div>
                  <div class="row">
                      <div class="col label">ফোন নম্বর:</div>
                      <div class="col">${loanInfo.msisdn}</div>
                  </div>
                  <div class="row">
                      <div class="col label">বকেয়া লোন:</div>
                      <div class="col">${loanInfo.due_loan} টাকা</div>
                  </div>
                  <div class="row">
                      <div class="col label">মেয়াদ শেষের তারিখ:</div>
                      <div class="col">${loanInfo.expires_in}</div>
                  </div>
              `;
              document.getElementById('response').innerHTML = infoHtml;
          }
      } else {
          showMessage('ত্রুটি: তথ্য প্রদানে সমস্যা হয়েছে।', true);
      }
  })
  .catch(error => {
      overlay.classList.add('hidden');
      showMessage('ত্রুটি: সার্ভারের সমস্যা রয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।', true);
      console.error('Error:', error);
  });
});
