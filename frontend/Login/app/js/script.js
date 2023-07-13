const emailInput = document.getElementById('mail_input');
const passwordInput = document.getElementById('password_input');
const loginButton = document.querySelector('.frame30__login-essntials__btn button');
function checkLogin(){
  const data = localStorage.getItem('responseData');
  console.log(data);
  if(data){
    window.location.assign('../../../../sources/dashboard.html');
  }
  
}
checkLogin();
loginButton.addEventListener('click', function() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const loginData = {
    email: email,
    password: password
  };

  sendLoginData(loginData);
});

function sendLoginData(loginData) {
  fetch('http://localhost:8000/api/user/login', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    console.log(response);
    if (response.ok) {
      return response.json();
    } 
  })
  .then(data => {
    console.log("gsdgag",JSON.stringify(data));
    if(data.token!==undefined){
      localStorage.setItem('responseData', JSON.stringify(data));
    }
    
    // if(data)
    checkLogin();
    // window.location.href = 'next-page.html';
  })
}



function openModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}


const emailInputForget = document.getElementById('emailInput');
const submitForgetEmail = document.getElementById('submitForgetEmail');
submitForgetEmail.addEventListener('click', function(e) {
  e.preventDefault();
  const email = emailInputForget.value;
  console.log(email);
  const data = {
    email: email
  }
  console.log(data);
   fetch('http://localhost:8000/api/user/resetLink', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
   }).then(response => {
    console.log(response);
    if (response.ok) {
      return response.json();
    }
  }).then(data => {
    console.log(data);
    if(data.message){
      showPopup(data.message);
    }
  }
  );
});
function showPopup(message) {
  var popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(function() {
    popup.remove();
  }, 800);}