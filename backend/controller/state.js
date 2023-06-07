const State = require('../Model/state');
const User = require('../Model/user');
const Tag = require('../Model/Tag');
// when any doc is approved then dispatcher is going to be tagged and then he will create a state i.e will be sending the doc to other person



module.exports.addState = async(req, res)=>{
  // state will be created by dispatcher only
  // user id and document id will be passed in the body using form
      try{
        const {user_id,document_id} = req.body;
        const user = await User.findById(user_id);
        if(user.length == 0){
          res.status(400).json({
              message:'user not found'
          })
          return;
        }

          if(user[0].designation != 'dispatcher'){
            res.status(400).json({
                message:'user is not a dispatcher'
            })
            return;
          }
   

    
           const newState = await State.create({
                user_id,
                document_id,
                received:'false',
                done:'false',
                
            });

            res.status(200).json({
                data:newState
              });


        }catch(err){
          console.log(err);
        }
        
       
      }


  



// delete a state

module.exports.deleteState = async(req, res)=>{
      try{
    const state_id = req.params.id;
    const deletedState = await State.findByIdAndDelete(state_id);

    res.status(200).json({
        data:deletedState
      });

      }catch(err){ 
        console.log(err);
      }

}

module.exports.received = async(req, res)=>{
    
    try{
        const state_id = req.params.id;
        const updatedState = await State.findByIdAndUpdate(state_id,{
            received:'true'
        });

        res.status(200).json({
                    data:updatedState
                  });
    }catch(e){
        console.log(e);
    }
}

module.exports.task_done = async(req, res)=>{
//    note when accepted or done is approved then we need to create a tag too which will call dispatcher 
    try{
        
        const state_id = req.params.id;
        const updatedState = await State.findByIdAndUpdate(state_id,{
            done:'true'
        });
        const state = await State.findById(state_id);
        const document_id = state.document_id;
        const document = await Document.findById(document_id);
        const tagged_by = document.user_id;
        const distachter = await User.find({designation:'dispatcher'});
        const tags = [];
        distachter.forEach( async (id) => {
            const tagged_to = id._id;
            const tag1 = await Tag.create({
              tagged_to:tagged_to,
              tagged_by:tagged_by,
              document_id:document_id
          });
         tags.push(tag1);
        });
       
        res.status(200).json({
            data:updatedState,
            tag:tags
          });
    }catch(e){

    }
    
}


module.exports.get_status = async(req, res)=>{
    
  try{
        const doc_id = req.params.id;
        const states = await State.find({document_id:doc_id});
        res.status.json({
            data:states
        });
     }catch(e){
        console.log(e);
     }
}