const Assigned = require('../Model/assigned');
const Tag  = require("../Model/Tag");
const User = require("../Model/user.js");
const rsa = require('node-rsa');
const Authorise = require('../Model/authorize');
const Document = require("../Model/document");
const { request } = require("express");
const { isValidObjectId } = require('mongoose');



// ##############################################document funtions#####################################################
module.exports.createdoc = async (req, res) => {
  const description = req.body.description.trim();
  const title = req.body.title.trim();
  const section = req.body.section.trim(); 
  const to = req.body.to.trim();
  if(!description || !title || !section || !to){
    res.status(400).json({
      message:'please provide all the details'
    })
    return;
  }
   // this is section of document
  // check if user is valid
 
  const created_by = req.user.id;
    const user = await User.findById(created_by);
    // we will get object directly here
    if(!user){
      res.status(400).json({
        message:'not a valid user as user is not found in database'
      })
      return;
    }
   const Dispatchers = await User.find({designation:'Dispatcher'});
  
  const newDoc = await Document.create({
    title: title,
    createdBy:created_by,
    section: section,
    description,
    to:to,
  })
 let requests = [];
   for(let i=0;i<Dispatchers.length;i++){
 const request =   await Assigned.create({
        document_id:newDoc.id,
        dispatcher_id:Dispatchers[i].id,
        senderId:created_by,
        status:'pending'
   });
   requests.push(request);
   }
  
  const authorise = await Authorise.create({
    user_id:created_by,
    document_id:newDoc.id,
  });
  const authorise2 = await Authorise.create({
    user_id:to,
    document_id:newDoc.id,
  });

  res.status(200).json({
    data: newDoc,
  });
 
};


module.exports.showAllDocs = async (req, res) => {
 try{
  const id = req.query.id;
  const section = req.query.section;
  const docs = await Document.find({createdBy:id, section:section}).populate('createdBy');
  
  res.status(200).json({
    data: docs,
  });
 }catch(e){
    console.log(e);
 }
 
};


module.exports.deleteDoc = async (req, res) => {
  
 
    const id = req.params.id;
    console.log(id);  
      const doc = await Document.findById(id);
    
      if(!doc){
        res.status(400).json({
          message:'doc not found'
        });
        return;
      }
    if(!doc.isDeletable()){
      res.status(400).json({
        message:'document is not deletable'
      });
      return;
    }
     

       
      if(doc.createdBy.equals(req.user._id)===false){
        res.status(400).json({
          message:'you are not authorized to delete this document'
        });
        return;
      }
      const tags = await Tag.deleteMany({document_id:id});
      const authorise = await Authorise.deleteMany({document_id:id});
      const assigned = await Assigned.deleteMany({document_id:id});
 
     const deleted_doc = await Document.findByIdAndDelete(id);
  res.status(200).json({
    data: doc,
  });
 
 
};


module.exports.updateDoc = async (req, res) => {
  
    const title = req.body.title;
    console.log(title);
    // this is id of the document
    const id = req.body.id;
    const description = req.body.description;

    const doc = await document.findById(id);
    console.log(doc);
    if (!doc) {
        res.status(400).json({
          message:'doc not found'
        })
    }
    
    doc.title = title;
    doc.description = description;
        doc.save();
     res.status(200).json({
      data: doc,
     })
  
};


// ##############################  authorise  ########################################

module.exports.signature = async (req,res)=>{
  // implimented by query 
  const doc_id = req.params.id;
  var private_key_val = req.body.privateKey;
   private_key_val = private_key_val.trim();
   if(!isValidObjectId(doc_id)){
    res.status(400).json({
      error:'invalid document id'
    });
    return;
  }
    const doc = await Document.findById(doc_id);
  if(doc.to.equals(req.user._id)===true){
    res.status(400).json({
      error:'Please do sign in approve section'
    });
    return;
  }


    if(doc.createdBy.equals(req.user._id)===true){
      res.status(400).json({
        error:'you are not authorized to sign this document'
      });
      return;
    }


    if(!doc){
      res.status(400).json({
        message:'doc not found'
      });
      return;
    }
    
     // checking if user is authorized to sign the document
     const authorise = await Authorise.findOne({user_id:req.user.id ,document_id:doc_id});
    
      if(!authorise){
        res.status(400).json({
          error:'you are not authorized to sign this document'
        });
        return;
      }

    // checking if user has done signature or not
    for(let i=0;i<doc.signature.length;i++){
      if(doc.signature[i].email===req.user.email){
        res.status(400).json({
          message:'you have already signed the document'
        });
        return;
      }
    }
   

    const private_key = new rsa();
    private_key.importKey(private_key_val,'private');
    
    const signature = private_key.encryptPrivate(req.user.email,'base64');
    const public_key = new rsa();
    public_key.importKey(req.user.publicKey,'public');
    try{
      const decrypted_signature = public_key.decryptPublic(signature,'utf8');
    }catch(e){
      res.status(400).json({
        message:'invalid private key'
      });
      return;
    }
   
   
    const signature_obj = { 
      signature:signature,
      email:req.user.email,
         };
    doc.signature.push(signature_obj);
    await doc.save();
    res.status(200).json({
      message:'signature added'
    })
};

module.exports.searchDoc = async (req, res) => {
  const keyword = req.params.id;
  const section = req.user.section;
  try {
    const documents = await Document.find({ 
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' },
      }
      ],
      section:section
    });


    res.status(200).json({
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while searching for documents.'
    });
  }
};

module.exports.getAccessDoc = async (req,res)=>{
  console.log(req.user);
  const doc_id = req.params.id;
  const user_id = req.user.id;
  const authorise = await Authorise.findOne({document_id:doc_id,user_id:user_id});
 

  const doc = await Document.findById(doc_id).populate('createdBy','name email');
  console.log(authorise);
  // if(doc.section === req.user.section){
  //   res.status(200).json({
  //     data:doc
  //   })
  //   return;
  // }
  if(authorise){
    res.status(200).json({
      data:doc
    })
    return;
  }
  res.status(400).json({
    message:'you are not authorised to view this document'
  });
  
};

module.exports.tagged_docs = async (req,res)=>{
  const user_id = req.user._id;
 
  console.log(req.user);
  const docs = await Tag.find({tagged_to:user_id}).populate(
  {
    path:'document_id',
    select:'title description section createdBy',

    populate:{
      path:'createdBy',
      select:'name email'
    }
  }
  ).populate({
    path:'tagged_from',
    select:'name email'
  }).populate({
    path:'tagged_to',
    select:'name email'
  });

  res.status(200).json({
    data:docs
  })
};

module.exports.created_docs = async (req,res)=>{
  const docs = await Document.find({createdBy:req.user.id}).populate({
    path:'createdBy',
    select:'name email'
  }).populate({
    path:'to',
    select:'name email'
    });
  res.status(200).json({
    data:docs,
    message:'success'
  });
};

module.exports.approveDoc = async (req, res) => {
  const {doc_id, privateKey} = req.body;
  const doc = await Document.findById(doc_id);
  if(!doc){
    res.status(400).json({
      message:'doc not found'
    })
    return;
  }
  
  if(doc.to.equals(req.user.id)===false){
    res.status(400).json({
      message:'you are not authorised to approve this document'
    });
    return;
      }

  const private_key = new rsa();
  private_key.importKey(privateKey,'private');
  const signature = private_key.encryptPrivate(req.user.email,'base64');
  try{
    const public_key = new rsa();
    public_key.importKey(req.user.publicKey,'public');
    const decrypted_signature = public_key.decryptPublic(signature,'utf8');
    if(decrypted_signature!==req.user.email){
      res.status(400).json({
        message:'invalid private key'
      });
      return;
    }
  }catch(e){
    res.status(400).json({
      message:'invalid private key'
    });
    return;
  }
  const signature_obj = {
    signature:signature,
    email:req.user.email

  }
  if(!doc){
    res.status(400).json({
      message:'doc not found'
    })
    return;
  }


  doc.approved = signature_obj;
  await doc.save();
  

  res.status(200).json({
    data: doc,
  });
};

module.exports.removeApproval = async (req,res)=>{
  const doc_id = req.params.id;
  console.log(doc_id);
  const doc = await Document.findById(doc_id);
 
  if(!doc){
    res.status(400).json({
      message:'doc not found'
    })
    return;
  }

   if(doc.approved === null){
    res.status(400).json({
      message:'doc is not approved yet'
    })
    return;
  }

  if(req.user.email !== doc.approved.email){
    res.status(400).json({
      message:'you are not authorized to remove approval'
    });
    return;
  }

  if(doc.disapprovable()=== false){
    res.status(400).json({
      message:'approval cannot be removed'
    })
    return;
  }
  doc.approved = null;
  await doc.save();
  res.status(200).json({
    message:'approval removed'
  })
};

module.exports.verifyapproval = async (req,res)=>{
  const doc_id = req.params.id;
  const doc = await Document.findById(doc_id);
  if(!doc){
    res.status(400).json({
      message:'doc not found'
    })
    return;
  }
  const user = await User.findOne({email:doc.approved.email});
  const public_key = new rsa();
  public_key.importKey(user.publicKey,'public');
  try{
    const decrypted = public_key.decryptPublic(doc.approved.signature,'utf8');
    if(decrypted === doc.approved.email){
      res.status(200).json({
        message:'Approval is Authentic',
      })
      return;
    } 
  }catch(e){
    res.status(400).json({
      message:'Approval is not Authentic'
    });
    return;
  }
 
  res.status(400).json({
    message:'Approval is not Authentic'
  });
};

module.exports.verifySignature = async (req,res)=>{
        const id = req.params.id;
        const doc = await Document.findById(id);
        if(!doc){
          res.status(400).json({
            message:'doc not found'
          })
          return;
        }
        const signatures = doc.signature;

        for(let i = 0; i < signatures.length; i++){
            const user = await User.findOne({email:signatures[i].email});
            const public_key = new rsa();
            public_key.importKey(user.publicKey,'public');
            try{
            const decrypted = public_key.decryptPublic(signatures[i].signature,'utf8');
              
            }catch(e){
              res.status(400).json({
                message:'Signature is not Authentic for ' + signatures[i].email
              });
              return;
            }

            if(decrypted !== signatures[i].email){
              res.status(400).json({
                message:'Signature is not Authentic'
              });
              return;
            }
          
        }

        res.status(200).json({
          message:'Signatures are Authentic'
        });
}

module.exports.deleteSignature = async (req,res)=>{
    const user  = req.user;
    const doc_id = req.params.id;
    const doc = await Document.findById(doc_id);
    if(!doc){
      res.status(400).json({
        message:'doc not found'
      })
      return;
    }
    if(doc.signature.length === 0){
      res.status(400).json({
        message:'no signatures to delete'
      })
      return;
    }
    const signatures = doc.signature;
    let flag = false;
    for(let i = 0; i < signatures.length; i++){
      if(signatures[i].email === user.email){
        flag = true;
        break;
      }
    }
    
}
