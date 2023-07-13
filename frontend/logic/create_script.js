const isLogin = ()=>{
  if(!localStorage.getItem('responseData')){
       window.location.assign('../Login/index.html');
  }
}
isLogin();
// const handleLogout = () => {
//   console.log('running');
//   localStorage.removeItem('responseData');
//   isLogin();
// }



document.addEventListener('DOMContentLoaded', function() {
  var selectedUserId = null; // Variable to store the selected user ID
  const responseData = JSON.parse(localStorage.getItem('responseData'));
  const token = responseData.token;
  // Make fetch request to fetch users
  fetch('http://localhost:8000/api/user/getUsers', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
    },
    mode: 'cors',
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch users.');
      }
    })
    .then(function(data) {
      var users = data.data;
      // Populate the dropdown with user names
      var dropdown = document.getElementById('to');
      users.forEach(function(user) {
        if (user.name === responseData.name || user.designation=="Dispatcher") {
          return; 
        }
      
        var option = document.createElement('option');
        option.value = user._id;
        option.text = user.name;
        dropdown.appendChild(option);
      });

      var users = data.data;

      var array = ['Library', 'Registrar', 'Accounts', 'Academics', 'infra', 'Public', 'Personal'];

      // Populate the dropdown with user names
      var dropdown2 = document.getElementById('section');
      array.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        option.text = item;
        dropdown2.appendChild(option);
      });

      // Handle dropdown selection change
      dropdown.addEventListener('change', function() {
        selectedUserId = this.value;
      });
    })
    .catch(function(error) {
      // Handle error case
      console.log(error.message);
    });

  // Example code to access the selected user ID
  // var submitButton = document.getElementById('submitBtn');
  // submitButton.addEventListener('click', function() {
  //   // Use the selectedUserId variable here as needed
  //   console.log(selectedUserId);
  });
// });




document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('myForm');
  var titleInput = document.getElementById('title');
  var sectionInput = document.getElementById('section');
  var toInput = document.getElementById('to');
  var descriptionInput = document.getElementById('description');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    var title = titleInput.value;
    var section = sectionInput.value;
    var to = toInput.value;
    var description = descriptionInput.value;

    var data = {
      title: title,
      section: section,
      to: to,
      description: description
    };

    const responseData = JSON.parse(localStorage.getItem('responseData'));
    const token = responseData.token;

    fetch('http://localhost:8000/api/document/create', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Error: ' + response.status + ' ' + response.statusText);
        }
        return response.json();
      })
      .then(function(responseData) {
        // Document creation successful
        showPopup('Congratulation! Your document is created');
        console.log(responseData);
        // Reset form fields
        titleInput.value = '';
        sectionInput.value = '';
        toInput.value = '';
        descriptionInput.value = '';
      })
      .catch(function(error) {
        console.error(error.message);
      });
  });

  function showPopup(message) {
    var popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(function() {
      popup.remove();
    }, 2000);
  }
});

