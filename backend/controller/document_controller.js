const document = require("../Model/Document");
const Document = require("../Model/Document");
const Tag  = require("../Model/Tag");
const User = require("../Model/user.js");
const rsa = require('node-rsa');
module.exports.createdoc = async (req, res) => {
 
  // this is id of user who is creating document

  const id = req.body.id;
  const description = req.body.description;
  const title = req.body.title;
  const section = req.body.section;  // this is section of document
  // check if user is valid

  console.log(req.body)

    const user = await User.findById(id);
    // we will get object directly here 

 
    if(!user){
      // invalid user
      res.status(400).json({
        message:'not a valid user as user is not found in database'
      })

      return;
    }
  const newDoc = await Document.create({
    title: title,
    createdBy: id,
    section: section,
    description,
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
  
  try{
    const id = req.params.id;
      const doc = await Document.findById(id);
   console.log(doc);
      if(!doc){
        res.status(400).json({
          message:'doc not found'
        });
        return;
      }
 
     const deleted_doc = await Document.findByIdAndDelete(id);
  res.status(200).json({
    data: doc,
  });
  }catch(e){
    console.log(e);
  }
 
};


module.exports.updateDoc = async (req, res) => {
  //   document id
  // user id
    
  try {
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
  } catch (e) {
      console.log(e);
  }

  
};


module.exports.approveDoc = async (req, res) => {
  try{
    const id = req.params.id;
    const doc = await Document.findById(id);
    if(!doc){
      res.status(400).json({
        message:'doc not found'
      })
      return;
    }
    doc.approved = !doc.approved;
    doc.save();
    res.status(200).json({
      data: doc,
    });
  }catch(e){
    console.log(e);
  }
 
};


module.exports.searchDoc = async (req, res) => {
  const keyword = req.params.id;

  try {
    const documents = await Document.find({ 
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
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

module.exports.signature = async (req,res)=>{
  // implimented by query 
  const user_id = req.query.user_id;
  const doc_id = req.query.doc_id;

  try{
    const user = await User.findById(user_id);
    const doc = await Document.findById(doc_id);
    if(!user || !doc_id){
      res.status(400).json({
        message:'user or doc not found'
      });
      return;
    }
    
    const email = user.email;
    const private_key = new rsa();
    private_key.importKey(user.private_key);
    const signature = private_key.sign(email,'base64','utf8');
    doc.signature.push(signature);
    doc.save();
    res.status(200).json({
      message:'signature added'
    })

  }catch(e){

   console.log(e);
  }

}