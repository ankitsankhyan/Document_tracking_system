const isLogin = ()=>{
  if(!localStorage.getItem('responseData')){
       window.location.assign('../Login/index.html');
  }
}
isLogin();
const searchDoc = document.getElementById('searchInput');
const getAccess = (element)=>{
  const doc_id = element.target.getAttribute('doc_id');
  const token = JSON.parse(localStorage.getItem('responseData')).token;
  fetch(`http://localhost:8000/api/document/accessDoc${doc_id}`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      window.location.assign(`../sources/document.html?doc_id=${doc_id}`);
    } else {
      notifyError('Not authorised to see this document');
      throw new Error('Could not get document');
    }
  })
 
}
console.log(searchDoc);
searchDoc.addEventListener('input',(e)=>{

 let keyword = e.target.value;
 if(keyword){
  fetch(`http://localhost:8000/api/document/search${keyword}`,{
    mode: 'cors',
    method: 'GET',
  
   }).then(res => {
    if(res.ok){
      return res.json()
    }
    console.log(res);
    }).then(data => {
      const docs = data.data;
        const dropdown = document.createElement('ul');
        dropdown.querySelectorAll('*').forEach(n => n.remove());
      dropdown.setAttribute('id','dropdown');

      for(doc of docs){
        console.log(doc);
        const option = document.createElement('li');
        option.setAttribute('doc_id', doc._id);
        
        option.textContent = doc.title;
        option.addEventListener('click',getAccess);
        dropdown.appendChild(option);
        const searchContainer = document.getElementById('searchContainer');
      
      
      }
      searchContainer.querySelectorAll('*').forEach(n => n.remove());

        searchContainer.appendChild(dropdown);
      
    });
 }else{
  const searchContainer = document.getElementById('searchContainer');
  searchContainer.querySelectorAll('*').forEach(n => n.remove());
  
 }
 
})
console.log('hello')


function searchDocuments() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
  
    var documentCards = document.getElementsByClassName("document-card");
    var highdocumentCards = document.getElementsByClassName("highlighted_card");
    
    for (var i = 0; i < documentCards.length; i++) {
      var documentCard = documentCards[i];
      var documentName = documentCard.getElementsByClassName("document-name")[0].innerText.toLowerCase();
  
      if (documentName.includes(searchInput)) {
        documentCard.style.display = "block";
      } else {
        documentCard.style.display = "none";
      }
    }
    for (var i = 0; i < highdocumentCards.length; i++) {
      var documentCard = highdocumentCards[i];
      var documentName = documentCard.getElementsByClassName("document-name")[0].innerText.toLowerCase();
  
      if (documentName.includes(searchInput)) {
        documentCard.style.display = "block";
      } else {
        documentCard.style.display = "none";
      }
    }
  }


  //////////////////////////////////////////////////////////////



  const documentCard = (title, author_name, description,id, seen = true, tagId = null,marko)=>{
     
    return (
      `
      <div target="_blank" class="${seen?'document-card':'highlighted_card'}" doc_id = ${id}  id = 'doc_card' tagId = ${tagId}  seen = ${seen} done=${marko}>
      <h2 class="document-name">${title}</h2>
      <br>
      <p class="document-author">Author: ${author_name}</p>
      <p class="document-description">
        ${description}
      </p>
    </div>
      `
    )
  }
var unseentags = [];
const get_all_tagged_documents = async(token)=>{
  fetch('http://localhost:8000/api/document/tagged_doc',{
      mode: 'cors',
      method: 'GET',
      headers: {
         'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
     }}).then(response => {
     
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    }).then(info => {
     const {data} = info;
    console.log("herefshjhsfjmxfhjmfhmh")
    console.log(data);
    for(let i = 0; i < data.length; i++){
      console.log("ADGshshshsh");
        console.log(data[i].document_id);
         const {title,description} = data[i].document_id;
         if(data[i].seen == false){

          unseentags.push(data[i]);
         }
         const author_name = data[i].document_id.createdBy.name;
         const marko=data[i].done;
         const doc_id = data[i].document_id._id;
    const card = documentCard(title,author_name,description,doc_id, data[i].seen,data[i]._id,marko);
  
    let cardContainer = document.getElementById('tagged-documents');
    cardContainer.innerHTML += card;
    }
      })
    }
   

const get_all_created_documents = async(token)=>{
  fetch('http://localhost:8000/api/document/show_created_doc',{
      mode: 'cors',
      method: 'GET',
      headers: {
         'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
     }}).then(response => {
     
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    }).then(info => {
      const {data} = info;
     
      for(let i = 0; i < data.length; i++){
    
        const {title,description} = data[i];
        const author_name = data[i].createdBy.name;
      
        const doc_id = data[i]._id;
      
    const card = documentCard(title,author_name,description,doc_id);
    const cardContainer = document.getElementById('created-documents');
    
    cardContainer.innerHTML += card;  
       
      }
    })
  }



const token = JSON.parse(localStorage.getItem('responseData')).token;



get_all_tagged_documents(token);
get_all_created_documents(token);




function addproperties(){
  var docs = document.querySelectorAll('#doc_card');
  console.log("dgdsgdgagaga");
  console.log(docs);
  docs.forEach((doc)=>{
    doc.addEventListener('click',()=>{
      const doc_id = doc.getAttribute('doc_id');
      const tag_id = doc.getAttribute('tagId');
      const seen = doc.getAttribute('seen');
      const marko =doc.getAttribute('done');
       console.log(doc_id);
      if(tag_id != null && seen == 'false'){
        fetch(`http://localhost:8000/api/document/seen${tag_id}`,{
          mode: 'cors',
          method: 'PATCH',
          headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(response => {       
        if (response.ok) {
            return response.json();
          } else {
            throw new Error('Already seen');
          }
        }).then(info => {

          localStorage.setItem('tag_id', tag_id);
          window.location.assign(`../sources/document.html?doc_id=${doc_id}`);
        })
        }
        else{
          localStorage.setItem('tag_id', tag_id);
          window.location.assign(`../sources/document.html?doc_id=${doc_id}`);
        }
    })
  })
}
setTimeout(addproperties,500)


/////////////////////////////////////
//code for get_request


const documentReq = (title, author_name,doc_id, tag_id, assigned = false) => {
  if (assigned == true) {
    return;
  }
  return `
    <div class='list-item' doc_id = ${doc_id} tag_id=${tag_id} id='list-item' assigned=${assigned}>
      <h3 class="doc-title">${title}</h3>
      <p class="author-name">Author:</p>
      <p class="author-name">${author_name}</p>
    </div>
  `;
}
;
const get_requested_documents = async (token) => {
  fetch('http://localhost:8000/api/document/requests', {
    mode: 'cors',
    method: 'GET',
    headers: {
      'authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('no requested document failed');
    }
  }).then(data => {
    const { data1 } = data;
    const listContainer = document.querySelector('.list-container');
    listContainer.innerHTML = ''; 
     
    data1.forEach((item) => {
      const doc_id = item.document_id._id;
      const tag_id = item._id;
      const author_name = item.senderId.name;
      const title = item.document_id.title;
      const doc_assign = item.assigned;
      const card = documentReq(title, author_name,doc_id, tag_id, doc_assign);

      if (card != null && doc_assign != null) {
        listContainer.innerHTML += card;
      }


    });
  }).catch(error => {
    console.error(error);
  });
};

get_requested_documents(token);



function rem_req() {
  var docs = document.querySelectorAll('#list-item');
  console.log(docs);
  docs.forEach((doc) => {
    doc.addEventListener('click', () => {
      const assign = doc.getAttribute('assigned');
      const tag_id = doc.getAttribute('tag_id');
      if (assign == 'false') {
        doc.setAttribute('assigned', 'true');
        console.log(doc.getAttribute('assigned'));
        const docId = doc.getAttribute('doc_id');
        console.log(docId);
        fetch(`http://localhost:8000/api/document/selectRequest${tag_id}`,{
          mode: 'cors',
          method: 'PATCH',
          headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(response =>{
          if (response.ok) {
                      return response.json();
                    } else {
                      notifyError('Request accepted Successfully');
                      throw new Error('Already assigned');
                    }}).then(() => {
                      notifyGood('Request accepted Successfully');
                      setTimeout(function() {
                        location.reload();
                      }, 800);
                    })  
      }
    });
  });
}


const designation = JSON.parse(localStorage.getItem('responseData')).designation;
if (designation === 'Dispatcher') {

 
  setTimeout(rem_req, 500);
}

  if (designation !== 'Dispatcher') {
    document.getElementById('for-documents').style.display = 'none';
  }


