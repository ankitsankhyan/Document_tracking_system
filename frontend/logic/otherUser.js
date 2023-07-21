

console.log('hello sir');
  
  
  
  function updataCredential(data) {
    let profile = document.getElementById('profilePhoto');
    profile.src = data.avatar.url;
   
    const user_name = data.name;
    const user_desig = data.designation;
    const user_sect =  data.section;
    const user_email = data.email;
    
    const name = document.getElementById('usr_name');
    const dept = document.getElementById('usr_depr');
    const section = document.getElementById('usr_sec');
    const designation = document.getElementById('usr_desg')
    const usr_email = document.getElementById('usr_email');
  
    name.innerHTML = user_name;
    section.innerHTML = user_sect;
    designation.innerHTML = user_desig;
    usr_email.innerHTML = user_email;
    
    
  
  }
  

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  const userId = urlParams.get('user_id');
const getUser = ()=>{
    fetch(`http://localhost:8000/api/user/profile${userId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }}).then(res =>{
         if(res.ok){
            return res.json();
         }
    }).then(data=>{
        console.log(data.data);
       updataCredential(data.data);
    })
}
  



    getUser()
  ////////////////////////////////////////////////////////////////
  
  // Function to fetch and display the count of created documents

  
  