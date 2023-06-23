const Tag = require('../Model/Tag');
const User = require('../Model/user');
const Document = require('../Model/document');
const Authorise = require('../Model/authorize');
const Assigned = require('../Model/assigned');
module.exports.addTag = async(req, res)=>{
      
        const{email, document_id} = req.body;
        
        const document  = await Document.findById(document_id);
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
        user_id = user.id;
        if(document.timeline[document.timeline.length-1].name === user.name && document.timeline[document.timeline.length-1].email === user.email){
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
        document.save();
       const tagged_to = user_id;
       const tagged_from = req.user.id;
        const tag = await Tag.create({tagged_to,tagged_from, document_id});
        const authorise = await Authorise.findOne({user_id:user_id, document_id:document_id});
        if(!authorise){
            const newAuthorise = await Authorise.create({user_id:user_id, document_id:document_id});
        }
        
        res.status(200).json({
            data:tag,
           
        });
}
module.exports.showalltaggedDoc = async(req, res)=>{
//    user id
const id = req.params.id;

const tag = await Tag.find({ tagged_to: id }).populate('document_id');

res.status(200).json({
    data:tag
})

};
module.exports.mark_as_seen = async(req, res) => {
        const doc_id = req.params.id;
       
        const tag = await Tag.findOne({document_id:doc_id, tagged_to:req.user.id});
       console.log(tag);
        const tag_id = tag.id;
       
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
    const tag = await Tag.findOne({document_id:doc_id, tagged_to:user_id});
    if(tag.tagged_to !== req.user.id){
      res.status(400).json({
                message:'Not authorised action'
            });

    }
    const updatedTag = await Tag.findByIdAndUpdate(tag._id,{
        done:true
    },{new:true});

    
    res.status(200).json({
        data:updatedTag
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
   request.assigned = true;
   await request.save();
   console.log(request);
   const rest_requests = await Assigned.find({document_id:request.document_id, assigned:false,senderId:request.senderId});
   for(let i = 0; i<rest_requests.length; i++){
         await rest_requests[i].deleteOne();
   }
   const tag = await Tag.create({tagged_to:request.dispatcher_id, tagged_from:request.senderId, document_id:request.document_id});
   const authorise = await Authorise.findOne({user_id:request.dispatcher_id, document_id:request.document_id});
   if(!authorise){
         const newAuthorise = await Authorise.create({user_id:request.dispatcher_id, document_id:request.document_id});
    }
    res.status(200).json({
        message:'Request accepted'
    });
}