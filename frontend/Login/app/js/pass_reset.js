

function validateForm() {
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword === confirmPassword) {
      // Redirect to index.html or perform further actions here
      window.location.href = "index.html";
    } else {
      // Show the popup and clear the form
      document.getElementById("popup").style.display = "block";
      document.getElementById("passwordForm").reset();
      return false; // Prevent form submission
    }
  }
   const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const submitPassword = document.getElementById('submitPassword');
  submitPassword.addEventListener('click', function(e) {
    e.preventDefault();
    const password = newPassword.value;
  
    if(password !== confirmPassword.value){
      notifyError("Password does not match");
      return;
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    const userId = urlParams.get('user_id');
    const data = {
      token: token,
      user_id: userId,
      password: password,
      confirmPassword: confirmPassword.value
    }
    fetch('http://localhost:8000/api/user/resetPassword', {
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
      notifyGood(data.message);
      window.location.replace("index.html");
    } 
  });
  });

 const verifyLink = ()=>{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');
  const userId = urlParams.get('user_id');
  console.log(token, userId);
  const data = {
    token: token,
    user_id: userId
  }
  fetch('http://localhost:8000/api/user/verifyLink', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    console.log(response);
    if (response.ok) {
      return response.json();
    }else{
      notifyError("Link is invalid");
      setTimeout(function() {

      window.location.replace("index.html");
    }, 1000);
  }
  })
  .then(data => {
    const received = data;
    console.log(received.message);
    
    notifyGood(received.message);
  })
  
    // if(data)
   
    // window.location.href
 }
verifyLink();


  // function closePopup() {
  //   document.getElementById("popup").style.display = "none";

  // }