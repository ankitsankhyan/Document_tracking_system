const Tag = require('../Model/tag');
const User = require('../Model/user');
const Document = require('../Model/document');
const Authorise = require('../Model/authorize');
const {isValidObjectId} = require('mongoose');
const Assigned = require('../Model/assigned');
module.exports.addTag = async(req, res)=>{
      
            
    const{email, document_id} = req.body;
    if(!email || !document_id){
        res.status(400).json({
            message:'Invalid request'
        });
        return;
    }
    const document  = await Document.findById(document_id);
    if(!document.approved){
         res.status(400).json({
            error:'document is approved already'
         })
    }
    if(!document){
        res.status(400).json({
            message:'Document does not exist'
        });
        return;
    }
 

    const currentDate = new Date();

  if(req.user.designation !== 'Dispatcher'){
    res.status(400).json({
        message:'Only Dispatcher can tag'
    });
    return;
  }
    const date = currentDate.toLocaleDateString();


    const time = currentDate.toLocaleTimeString();
    const user =await User.findOne({email:email});
    const prv_tag = await Tag.find({document_id:document_id, tagged_from:req.user.id, tagged_to:user.id, done:'false'});
    if(prv_tag.length > 0){
        res.status(400).json({
            message:'Already tagged'
        });
        return;
    }
   console.log(user);
   console.log(document);
   
   console.log(user, document);
   const tagged_to = user.id;
   const tagged_from = req.user.id;
    const tag = await Tag.create({tagged_to,tagged_from, document_id});
    const authorise = await Authorise.findOne({user_id:user.id, document_id:document_id});
    if(!authorise){
        const newAuthorise = await Authorise.create({user_id:user.id, document_id:document_id});
    }
    if( document.timeline.length > 0 &&  document.timeline[document.timeline.length-1].name === user.name && document.timeline[document.timeline.length-1].email === user.email){
        res.status(400).json({
            message:'Already tagged'
        });
        return;
    }
    document.timeline.push({
        name:user.name,
        email:user.email,
        date:date,
        time:time,
    });

    await document.save();
    res.status(200).json({
        data:tag,
       
    });
}
module.exports.showalltaggedDoc = async(req, res)=>{
// 
const id = req.params.id;
if(isValidObjectId(id)){
    res.status(400).json({
        message:'Invalid id'
    });
    return;
}
const tag = await Tag.find({ tagged_to: id }).populate('document_id');
console.log(tag);
res.status(200).json({
    data:tag
})

};
module.exports.mark_as_seen = async(req, res) => {
        const tag_id = req.params.id;
        // const doc = await Document.findById(doc_id);
        // if(!doc){
        //     res.status(400).json({
        //         message:'Document does not exist'
        //     });
        //     return;
        // }
        const tag = await Tag.findById(tag_id);
        if(!tag){
            res.status(400).json({
                message:'Tag does not exist'
            });
            return;
        }
      
        if(!tag.tagged_to.equals(req.user._id)){
           res.status(400).json({
                message:'Not authorised action'
            });
            return;
        }
        if(tag.seen === true){
            res.status(400).json({
                message:'Already seen'
            });
            return;
        };
        const updatedTag = await Tag.findByIdAndUpdate(tag_id,{
            seen:true
        },{
            new:true
        });
        res.status(200).json({
            data:updatedTag
        });
  
}

module.exports.mark_as_done = async(req, res) => {
  
    const doc_id = req.params.id;
    const user_id = req.user.id;
    if(req.user.designation === 'dispatcher'){
        res.status(400).json({
            error:"Dispatcher can't mark as done"
        })
        return;
    }
    const tags = await Tag.find({document_id:doc_id, tagged_to:user_id, done:false});
    
    console.log(tags,'$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    if(tags.length == 0){
        res.status(400).json({
            error:'Mark as done'
        });
        return;
    }

    console.log(tags.length, 'printing tags');
    if(tags[0].done == true){
        res.status(400).json({
            error:'Already done'
        });
        return;
    }
    if(tags.length > 1){
        res.status(400).json({
            error:'More than one tag'
        })
        return;
    }
    console.log(tags);
    const tag = tags[0];
    if(tag.done == true){
        res.status(400).json({
                    error:'Already done'
                });
                return;
    }
    tags.forEach(async(tag) =>{
         tag.done = true;
        await tag.save();

    });

   
    const Dispatchers = await User.find({designation:'Dispatcher'});
if(req.user.designation !== 'Dispatcher'){
   let requests = [];
     for(let i=0;i<Dispatchers.length;i++){
   const request =   await Assigned.create({
          document_id:tag.document_id,
          dispatcher_id:Dispatchers[i].id,
          senderId:user_id,
        
     });
     requests.push(request);
     }
    }
    console.log(requests);
    
    res.status(200).json({
        data:tags
    });

 
 

}

module.exports.delete_tag = async(req,res)=>{
    if(req.user.designation !== 'Dispatcher'){
        res.status(400).json({
            message:'Only Dispatcher can delete tag'
        });
        return;
        }

         const id = req.params.id;
         console.log(id);
          const tag = await Tag.findById(id);
          const doc_id = tag.document_id;
            const user_id = tag.tagged_to;
          if(!tag){
            res.status(400).json({
                message:'No such tag'
            });
            return;
            }
          const doc = await Document.findById(doc_id);
          const user = await User.findById(user_id);
            const index = doc.timeline.findIndex(obj => obj.name === user.name && obj.email === user.email);
            doc.timeline.splice(index,1);
            doc.save();
          const authorise = await Authorise.findOneAndDelete({user_id:user_id, document_id:doc_id});
          await tag.deleteOne();
            res.status(200).json({
                message:'Tag deleted'
            });

}

module.exports.selectRequest = async(req, res)=>{
    if(req.user.designation !== 'Dispatcher'){
        res.status(400).json({
            message:'Only Dispatcher can select request'
        });
        return;
        }
   
   const id = req.params.id;
   const request = await Assigned.findById(id);
   console.log(request.dispatcher_id);
   if(!request.dispatcher_id.equals(req.user.id)){
         res.status(400).json({
                error:"Not authorised action"
            });
            return;
   }
  
   if(!request){
    res.status(400).json({
        error:"no request is there"
    })
   }

   if(request.assigned == true){
    res.status(200).json({
      error: "request is already assigned"
    })
    return;
 }

   request.assigned = true;
   await request.save();

   const rest_requests = await Assigned.find({document_id:request.document_id, assigned:false,senderId:request.senderId});
   for(let i = 0; i<rest_requests.length; i++){
         await rest_requests[i].deleteOne();
   }
   const tag = await Tag.create({tagged_to:request.dispatcher_id, tagged_from:request.senderId, document_id:request.document_id});
   console.log(tag);
   const authorise = await Authorise.findOne({user_id:request.dispatcher_id, document_id:request.document_id});
   if(!authorise){
         const newAuthorise = await Authorise.create({user_id:request.dispatcher_id, document_id:request.document_id});
    }

    const document = await Document.findById(request.document_id);
    console.log(document);
    if( document.timeline.length > 0 &&  document.timeline[document.timeline.length-1].name === req.user.name && document.timeline[document.timeline.length-1].email === req.user.email){
        res.status(400).json({
            message:'Already tagged'
        });
        return;
    }


    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();


    const time = currentDate.toLocaleTimeString();
    document.timeline.push({
        name:req.user.name,
        email:req.user.email,
        date:date,
        time:time,
    });

    await document.save();
    res.status(200).json({
        message:'Request accepted'
    });
}

module.exports.allrequests = async(req, res)=>{
    console.log('running');
     console.log(req.user);
    if(req.user.designation !== 'Dispatcher'){
        res.status(400).json({
            message:'Only Dispatcher can see requests'
        });
        return;
        }
 
    const requests = await Assigned.find({dispatcher_id:req.user.id, assigned:false}).populate({
        path:'document_id',
        select:'title description timeline to',

        populate:{
            path:'to',
            select:'name email'
        }


    }).populate({
        path:'senderId',
        select:'name email'
    })
    
    res.status(200).json({
        data1:requests
    });
}
module.exports.getTags = async(req, res)=>{
    var doc_id = req.params.id;
    console.log(doc_id);
    
    if(!isValidObjectId(doc_id)){
           res.status(400).json({
                           message:'Invalid id'
                       });
                       return;
    }

    const tags = await Tag.find({document_id:doc_id, tagged_to:req.user.id});
    res.status(200).json({
             data:tags
         });
   
}