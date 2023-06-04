const State = require('../Model/state');
const User = require('../Model/user');

module.exports.addState = async(req, res)=>{
      try{
        const {user_id,document_id} = req.body;
        const user = await User.findById(user_id);

        if(user.designation != 'dispatcher'){
           req.state(403).json({
            message:'not authorized'
           })
        }
        const newState = await State.findOne({
            user_id,
            document_id
        });

        if(!newState){
            newState = await State.create({
                user_id,
                document_id,
                received:'false',
                done:'false',
                
            });

            res.status(200).json({
                data:newState
              });


        }else{
            res.status(200).send({
                message:'State already exists'
            })
        }
       
      }catch(err){
        console.log(err);
      }


      
}

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

}
