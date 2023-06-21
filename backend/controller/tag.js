const Tag = require('../Model/Tag');
const User = require('../Model/user');
const State = require('../Model/state');
module.exports.addTag = async(req, res)=>{
      
        const{user_id, document_id} = req.body;
        const document  = await Document.findbyId(id);
        const currentDate = new Date();
      if(req.user.designation !== 'Dispatcher'){
        res.status(400).json({
            message:'Only Dispatcher can tag'
        });
        return;
      }
        const date = currentDate.toLocaleDateString();


        const time = currentDate.toLocaleTimeString();
        const user =await User.findById(user_id);
        document.timeline.push({
            user:user,
            date:date,
            time:time,
        });
       const tagged_to = user_id;
       const tagged_from = req.user.id;
        const tag = await Tag.create({tagged_to,tagged_from, document_id});
        const newState = await State.create({user_id:user_id, document_id:document_id});
        
        res.status(200).json({
            data:tag,
            newState:newState
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
        const tag_id = req.params.id;
        const tag = await Tag.findById(tag_id);
        if(tag.tagged_to !== req.user.id){
           res.status(400).json({
                message:'Not authorised action'
            });
            return;
        }
        const updatedTag = await Tag.findByIdAndUpdate(tag_id,{
            seen:true
        });
        res.status(200).json({
            data:updatedTag
        });
  
}

module.exports.mark_as_done = async(req, res) => {
    
    const {doc_id} = req.body;
    const user_id = req.user.id;
    const tag = await Tag.findOne({document_id:doc_id, tagged_to:user_id});
    if(tag.tagged_to !== req.user.id){
      res.status(400).json({
                message:'Not authorised action'
            });

    }
    const updatedTag = await Tag.findByIdAndUpdate(tag._id,{
        done:true
    });
    res.status(200).json({
        data:updatedTag
    });

 

}