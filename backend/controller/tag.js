const Tag = require('../Model/Tag');
const Document = require('../Model/Document');
module.exports.addTag = async(req, res)=>{
    try{
        const{user_id, document_id} = req.body;
        const tag = await Tag.create({user_id, document_id});
        res.status(200).json({
            data:tag
        });
    }catch(e){
        console.log(e);
    }
      

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
    try{
        const tag_id = req.params.id;
        const updatedTag = await Tag.findByIdAndUpdate(tag_id,{
            seen:true
        });
        res.status(200).json({
            data:updatedTag
        });
    }catch(e){
        console.log(e);
    }
  
}