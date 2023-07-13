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



const token = JSON.parse(localStorage.getItem('responseData')).token;
const url = window.location.href;
const doc_id = url.split('?')[1].split('=')[1];
// console.log(doc_id);
// Get the elements
const signatureDiv = document.getElementById('signat');
const fileInput = document.getElementById('sig1');
const submitButton = document.getElementById('sign-button1');
const verApr = document.getElementById('sign-button3');
const verSig = document.getElementById('sign-button4');




/////////////////////////
// verify approval
verApr.addEventListener('click', async () => {
      const response = await fetch(`http://localhost:8000/api/document/verifyapproval${doc_id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,

        },
      });
      if (response.ok) {
        showPopup('Approval of document has been verified!');
      }
      else{
        showPopup('Approval of document is not correct!');
      }
    }); 

    verSig.addEventListener('click', async () => {
      const response = await fetch(`http://localhost:8000/api/document/verifySignatures${doc_id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log(response.data);
        showPopup('Signatures of document has been verified!');
      }
      else{
        showPopup('Signatures of document are not correct!');
      }
  
    });
/////////////////////////////

// Add event listener to the submit button
submitButton.addEventListener('click', async () => {
  // Get the document ID from wherever it is stored (e.g., localStorage)

  // Get the uploaded file
  const file = fileInput.files[0];
  console.log(file);

  if (file) {
    try {
      // Read the content of the file
      const fileContent = await readFileContent(file);
      console.log(fileContent);

      // Create the request body
      const requestBody = JSON.stringify({
        privateKey: fileContent,
      });

      // Send a POST request to the API endpoint
      const response = await fetch(`http://localhost:8000/api/document/signature${doc_id}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,

        },
        body: requestBody,
      });

      if (!response.ok) {
        // Handle error if the request was not successful
        throw new Error('Failed to submit signature');
      }
      showPopup('Signature done successfully!');
      // Handle the successful response
      // ...
    } catch (error) {
      console.error(error);
      showPopup('Wrong Signature!');
      // Handle error
    }
  } else {
    console.error('No file selected');
    // Handle error
  }
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

// Function to read the content of a file
function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      resolve(content);
    };

    reader.onerror = (event) => {
      reject(event.error);
    };

    reader.readAsText(file);
  });
}

////////////////////////////////////////////////////////////////
const signature1Div = document.getElementById('appro');
const file1Input = document.getElementById('sig2');
const submit1Button = document.getElementById('sign-button2');

// Add event listener to the submit button
submit1Button.addEventListener('click', async () => {
  // Get the document ID from wherever it is stored (e.g., localStorage)

  // Get the uploaded file
  const file = file1Input.files[0];
  console.log(file);

  if (file) {
    try {
      // Read the content of the file
      const fileContent = await readFileContent(file);
      console.log(fileContent);

      // Create the request body
      const requestBody = JSON.stringify({
        doc_id:doc_id,
        privateKey: fileContent,
      });

      // Send a POST request to the API endpoint
      const response = await fetch(`http://localhost:8000/api/document/approved`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,

        },
        body: requestBody,
      });

      if (!response.ok) {
        // Handle error if the request was not successful
        throw new Error('Failed to submit signature');
      }
      showPopup('Approval done successfully!');

      // Handle the successful response
      // ...
    } catch (error) {
      console.error(error);
      // Handle error
    }
  } else {
    showPopup('Wrong Signature!');
    console.error('No file selected');
    // Handle error
  }
});

// Function to read the content of a file
function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      resolve(content);
    };

    reader.onerror = (event) => {
      reject(event.error);
    };

    reader.readAsText(file);
  });
}


////////////////////////////////////////////////////////////////
// retrieving the timeline information

const gdocument = (token, doc_id) => {
  fetch(`http://localhost:8000/api/document/accessDoc${doc_id}`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Could not get document');
    }
  }).then(info => {
    // console.log(info);
    const { data } = info;

    // Access the timeline array from the data object
    const timeline = data.timeline;

    // Get the timeline container element
    const timelineContainer = document.getElementById('timeline');

    // Loop through the timeline array and create the list items dynamically
    timeline.forEach(item => {
      const listItem = document.createElement('li');
      listItem.classList.add('li', 'complete');

      const timestampDiv = document.createElement('div');
      timestampDiv.classList.add('timestamp');

      const dateSpan = document.createElement('span');
      dateSpan.classList.add('date');
      dateSpan.innerText = item.date;

      timestampDiv.appendChild(dateSpan);
      listItem.appendChild(timestampDiv);

      const statusDiv = document.createElement('div');
      statusDiv.classList.add('status');

      const h4 = document.createElement('h4');
      h4.innerText = item.name;

      statusDiv.appendChild(h4);
      listItem.appendChild(statusDiv);

      timelineContainer.appendChild(listItem);
    });
  }).catch(error => {
    console.log(error);
  });
};
gdocument(token, doc_id);

//////////////////////////////////////////////////////////
//add tag area



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
    const responseData = JSON.parse(localStorage.getItem('responseData'));
    var dropdown = document.getElementById('title');
    users.forEach(function(user) {
      if (user.designation === "Dispatcher") {
        return; 
      }
      var option = document.createElement('option');
      option.value = user.email;
      option.text = user.name;
      dropdown.appendChild(option);
    });
    dropdown.addEventListener('change', function() {
      selectedUserId = this.value;
    });

    var submitButton = document.getElementById('signad-button');
    submitButton.addEventListener('click', function() {
      var documentId = doc_id; 
      var requestBody = JSON.stringify({
        email: dropdown.value,
        document_id: documentId
      });
      console.log("sadgbsabadb");
      console.log(requestBody);
      fetch('http://localhost:8000/api/document/newTag', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
        .then(function(response) {

          console.log("happy");
          console.log(response);
          if (response.ok) {
            console.log('Data sent to backend successfully');
          } else {
            throw new Error('Failed to send data to backend.');
          }
          window.location.reload();
        })
        .catch(function(error) {
          console.log(error.message);
        });
    });
  })
  .catch(function(error) {
    console.log(error.message);
  })




//////////////////////////////////////////////
console.log('dune');
// mark as done

const get_tags = async () => {
  const response = await fetch(`http://localhost:8000/api/document/get_tags${doc_id}`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Could not get tag');
  }

  const data = await response.json();
  console.log('get tag:' ,data)
  const checkmarkContainer = document.getElementById('checkmark-container');
  const checkmark = document.createElement('div');
  checkmark.classList.add('checkmark');
  

  
     
      if (data && data.data[0].done) {
        checkmark.classList.add('done');
      } else {
        const markButton = document.createElement('button');
        markButton.textContent = 'Mark';
        markButton.addEventListener('click', async () => {
          await markAsDone();
         
        });
        checkmark.appendChild(markButton);

      }
  
      checkmarkContainer.appendChild(checkmark);
    

  async function markAsDone() {
    const response = await fetch(`http://localhost:8000/api/document/done${doc_id}`, {
      mode: 'cors',
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
     window.location.reload();
    if (!response.ok) {
      throw new Error('Could not mark as done');
    }
  }
  console.log('before');
  console.log(data);
  console.log('after');
};

get_tags();


const markAsDone = async (itemId) => {
  const response = await fetch(`http://localhost:8000/api/document/done${itemId}`, {
    mode: 'cors',
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ done: true })
  });

  if (!response.ok) {
    throw new Error('Could not mark as done');
  }

  // Refresh the checkmarks after marking as done
  get_tags();
};



///////////////////////////////////////////////////////////////////
//retreiving description, title, created by and section
console.log(doc_id);
const get_document = (token,doc_id)=>{
     fetch(`http://localhost:8000/api/document/accessDoc${doc_id}`,{
      mode: 'cors',
      method: 'GET',
      headers: {
          'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
     }}).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('could not get dacument');
      }
    }).then(info => {
      console.log(info);
      const {data} = info;
      const signatures = data.signature;

      const container = document.getElementById("signature-container");

      signatures.forEach((signature) => {
        const div = document.createElement("div");
        div.classList.add("signature");
        div.textContent = signature.email;
        container.appendChild(div);
      });

      console.log(JSON.parse(localStorage.getItem('responseData')).email);
      // if(data.approved)
      // {
      //   showPopup('This document has been approved!');

      // }
      if (JSON.parse(localStorage.getItem('responseData')).email === data.to.email) {
        console.log("hellya");
        document.getElementById('appro').style.display = 'flex';
        document.getElementById('signu').style.display = 'none';
      } else {
        document.getElementById('appro').style.display = 'none';
        document.getElementById('signu').style.display = 'flex';
      }
      if(JSON.parse(localStorage.getItem('responseData')).designation === "Dispatcher")
      {
        console.log("Ram RAj");
        document.getElementById('appro').style.display = 'none';
        document.getElementById('signu').style.display = 'none';
        document.getElementById('marko').style.display = 'none';
        
      }
      if (JSON.parse(localStorage.getItem('responseData')).designation !== "Dispatcher") {
        document.getElementById("add-entry-form").style.display = "none";
      } 
      console.log(data);
      const description = document.getElementById('para-desc');
      description.innerHTML = data.description;
      const title = document.getElementById('para-title');
      title.innerHTML = data.title;
      const author = document.getElementById('created-desc');
      const section = document.getElementById('section-desc');
      section.innerHTML = data.section;
      author.innerHTML = data.createdBy.name;

    });

}
get_document(token,doc_id);

//////////////////////////////////////////////////////////////////