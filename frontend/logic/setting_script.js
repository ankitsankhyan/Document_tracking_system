
const isLogin = ()=>{
  if(!localStorage.getItem('responseData')){
       window.location.assign('../Login/index.html');
  }
}

isLogin();

const handleLogout = () => {
  console.log('running');
  localStorage.removeItem('responseData');
  isLogin();
}


const logout = document.getElementById('logout');
console.log(logout);
logout.addEventListener('click', handleLogout);


const generateButton = document.getElementById('generate-button');
const generateModal = document.getElementById('generate-modal');
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const closeButton = document.getElementsByClassName('generate-close');
const resultModal = document.getElementById('result-modal');
const resultModalData = document.getElementById('generate-modal-data');

generateButton.addEventListener('click', () => {
  generateModal.style.display = 'block';
});




passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  generateModal.style.display = 'none';
  const token = JSON.parse(localStorage.getItem('responseData')).token;
  const password = passwordInput.value;

  const requestBody = {
    password: password
  };

  fetch('http://localhost:8000/api/user/generateKeys', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(data => {
      const privateKey = data.private_key; // Extract the "private_key" value from the response

      resultModalData.textContent = formatJSONData(data); // Display both parts in the modal
      resultModal.style.display = 'block';
      
      if (privateKey !== undefined) {
        // Create a new file with only the private key value
        const privateKeyBlob = new Blob([privateKey], { type: 'text/plain' });
        const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
        const privateKeyLink = document.createElement('a');
        privateKeyLink.href = privateKeyUrl;
        const namo=JSON.parse(localStorage.getItem('responseData')).name;
        privateKeyLink.download = `${namo}private-key.txt`;
        privateKeyLink.click();
      }
    })
    .catch(error => {
      console.error(error);
    });
});



[...closeButton].forEach(button => {
  button.addEventListener('click', () => {
    generateModal.style.display = 'none';
    resultModal.style.display = 'none';
  });
});

window.addEventListener('click', (event) => {
  if (event.target === generateModal) {
    generateModal.style.display = 'none';
  }
  if (event.target === resultModal) {
    resultModal.style.display = 'none';
  }
});

function formatJSONData(data) {
  return JSON.stringify(data, null, 2).replace(/[{}]/g, '');
}


const checkGenerateModalDisplay = () => {
  const isGenerateModalHidden = generateModal.style.display === 'none';
  const isResultModalHidden = resultModal.style.display === 'none';

  if (!isGenerateModalHidden || !isResultModalHidden) {
    generateModal.style.display = 'none';
    resultModal.style.display = 'none';
  }
};



if(JSON.parse(localStorage.getItem('responseData')).designation !== "Admin")
  {    
    document.getElementById('for-admin').style.display = 'none';
  }

window.addEventListener('load', checkGenerateModalDisplay);



//////////////////////////////////////////////////////////////////////////
const modal = document.querySelector(".user-generate-modal");

const generateBtn = document.querySelector(".generate-btn");

const closeBtn = modal.querySelector(".close");

generateBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


(function() {
  const form = document.getElementById('user-form');
  form.addEventListener('submit', function(e) {
  e.preventDefault();
  const payload = new FormData(form);
  console.log(payload);
  fetch('http://localhost:8000/api/user/createUser', {
  method: 'POST',
  body: payload,
  })
  .then(res => {
    if(!res.ok){
      notifyError("User not created, please try again!");
    }
    res.json()})
  .then(data => {
    notifyGood("User created successfully!");
  })
  })
  })()




//////////////////////////////////////////////////////////////////////////


const change_pass=document.getElementById('pass-password-form');

const modals = document.querySelector(".pass-generate-modal");

const generateBtns = document.querySelector(".generate-btns");

const closeBtns = document.querySelector(".pass-generate-close");

generateBtns.addEventListener("click", () => {
  modals.style.display = "block";
});

closeBtns.addEventListener("click", () => {
  modals.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modals.style.display = "none";
  }
});

change_pass.addEventListener('submit', (e) => {
  e.preventDefault();
  generateModal.style.display = 'none';
  const token = JSON.parse(localStorage.getItem('responseData')).token;
  const oldPassword = document.getElementById("pass-old-password-input").value;
  const newPassword = document.getElementById("pass-new-password-input").value;
  const confirmNewPassword = document.getElementById("pass-con-password-input").value;
  console.log(confirmNewPassword, oldPassword, newPassword);
  const payload = {
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmNewPassword: confirmNewPassword
  };
  if(confirmNewPassword!=newPassword)
  {
    notifyError("New password & confirm password should be same!")
    return;
  }
  fetch("http://localhost:8000/api/user/changePassword", {
    method: "PATCH",
    mode:'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      console.log(response.data);
      if (response.ok) {
        notifyGood("Password changed successfully!");
        modals.style.display = "none";
        return response.json();
      } else {
        notifyError("Password change failed! Type correct password");
      }
    }).then(
      response=>{
        console.log(response.data);
      }
    )
    .catch(error => {
      console.error("Error:", error);
    });
});

// import { notifyGood, notifyError } from './test.js';
