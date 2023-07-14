const isLogin = ()=>{
  if(!localStorage.getItem('responseData')){
       window.location.assign('../Login/index.html');
  }}
isLogin();


const searchDoc = document.getElementById('searchInput');
const getProfile = (element)=>{
  alert('working');
  const user_id = element.target.getAttribute('user_id');
  console.log(user_id);
  window.location.assign(`../sources/otherUser.html?user_id=${user_id}`);
}


searchDoc.addEventListener('input',(e)=>{
const token = JSON.parse(localStorage.getItem('responseData')).token;
 let keyword = e.target.value;
 if(keyword){
  fetch(`http://localhost:8000/api/user/search${keyword}`,{
    mode: 'cors',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
   }).then(res => {
    if(res.ok){
      return res.json()
    }
    console.log(res);
    }).then(data => {
      console.log(data);
      
      const users = data.data;
        const dropdown = document.createElement('ul');
        dropdown.querySelectorAll('*').forEach(n => n.remove());
      dropdown.setAttribute('id','dropdown');

      for(user of users){
        console.log(user);
        const option = document.createElement('li');
        option.setAttribute('user_id', user._id);
        const p = document.createElement('p');
        p.textContent = user.name;
        const img = document.createElement('img');
        img.src = user.avatar.url;
        option.appendChild(img);
        option.appendChild(p);
       
        option.addEventListener('click',getProfile);
        dropdown.appendChild(option);
        const searchContainer = document.getElementById('searchContainer');
      
      
      }
      searchContainer.querySelectorAll('*').forEach(n => n.remove());

        searchContainer.appendChild(dropdown);
      
    });
 }else{
  const searchContainer = document.getElementById('searchContainer');
  searchContainer.querySelectorAll('*').forEach(n => n.remove());
  
 }})









const editLink = document.getElementById('editLink');

const modal = document.querySelector(".user-generate-modal");


const closeBtn = modal.querySelector(".close");

editLink.addEventListener("click", () => {
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
  const token = JSON.parse(localStorage.getItem('responseData')).token;
  const form = document.getElementById('user-form');
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');
  const designationInput = document.getElementById('designation');
  const sectionInput = document.getElementById('section');
  const emailInput = document.getElementById('email');
  const photoInput = document.getElementById('photo');

  // Retrieve data from local storage
  const userData = JSON.parse(localStorage.getItem('responseData'));

  // Pre-fill form fields with data
  nameInput.value = userData.name;
  passwordInput.value = ''; // Password field should not be pre-filled for security reasons
  designationInput.value = userData.designation;
  sectionInput.value = userData.section;
  emailInput.value = userData.email;
  sectionInput.disabled = true;
  emailInput.disabled = true;
  form.addEventListener('submit', function(e) {
  e.preventDefault();
  const payload = new FormData(form);
  payload.append('section', sectionInput.value);
  payload.append('email', emailInput.value);
  console.log(payload);
  fetch('http://localhost:8000/api/user/updateCredentials', {
  method: 'POST',
  headers: { "Authorization": `Bearer ${token}`},
  body: payload,
  })
  .then(res => {

    return res.json()})
  .then(data => {console.log(data)
   console.log(data.data);
  const updatedData = data?data.data:null;
  console.log(updatedData);
  if(updatedData) {
      updatedData.token = token;
      localStorage.removeItem('responseData');
        localStorage.setItem('responseData', JSON.stringify(updatedData));
        console.log("sadgsadgsdgsgsg");
      updataCredential(updatedData);
  }})

  })
  })()

const data = JSON.parse(localStorage.getItem('responseData'));
let profile = document.getElementById('profilePhoto');

console.log(data);
console.log(data.email);
console.log(usr_email);
usr_email.innerHTML = data.email;
usr_name.innerHTML = data.name;
profile.src = data.avatar.url;
usr_sec.innerHTML = data.section;
usr_depr.innerHTML = data.designation;



function updataCredential(data) {
  let profile = document.getElementById('profilePhoto');
  profile.src = data.avatar.url;
  console.log(data.avatar.url, profile.src);
  console.log(profile);
  const user_name = data.name;
  const user_depart = data.designation;
  const user_sect =  data.section;
  console.log(user_depart);
  
    document.getElementById('usr_depr').innerHTML= user_depart; // Update the user department on the webpage
  document.getElementById('usr_name').innerHTML = user_name; // Update the user name on the webpage
  document.getElementById('usr_sec').innerHTML= user_sect; // Update the user section on the webpage
  notifyGood("Your data has been updated!");

}



////////////////////////////////////////////////////////////////

// Function to fetch and display the count of created documents
document.addEventListener('DOMContentLoaded', () => {
  const updateCreatedDocumentCount = (count) => {
    const createdElement = document.getElementById('created-doc-count');
    createdElement.textContent = ` ${count}`;
  };

  const updateTaggedDocumentCount = (count) => {
    const taggedElement = document.getElementById('tagged-doc-count');
    taggedElement.textContent = ` ${count}`;
  };

  const showCreatedDocuments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('responseData')).token;
      const response = await fetch('http://localhost:8000/api/document/show_created_doc', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch created documents');
      }
      const {data} = await response.json();
      const createdCount = data.length; 
  
      updateCreatedDocumentCount(createdCount);
    } catch (error) {
      console.error(error);
    }
  };
  
  const showTaggedDocuments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('responseData')).token;
      const response = await fetch('http://localhost:8000/api/document/tagged_doc', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tagged documents');
      }
      const {data} = await response.json();

      const taggedCount = data.length;
  
      updateTaggedDocumentCount(taggedCount);
    } catch (error) {
      console.error(error);
    }
  };

  setTimeout(showCreatedDocuments, 100);
  setTimeout(showTaggedDocuments, 100);
});