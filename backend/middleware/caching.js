const redis = require('redis');
const keys = require('./rediskeys');

const client = redis.createClient({
    legacyMode: true,
});
client.connect();

client.on('ready', ()=> console.log('redis connected'));
client.on('error', (err)=> console.log('redis error', err));
function redisUserMiddleware(req, res, next){
   
    const isSearchRoute = req.url.slice(0,7) === '/search';
    if(isSearchRoute){
        let keyword = 'user_';
        keyword += req.url.slice(7);
       console.log(keyword, 'inside redis');
         client.get(keyword, (err, data)=>{
            if(err){
             console.log(err);
             res.status(500).json({error: 'internal server error'});
             return;
            }
            if(data !== null && data !== undefined){
                console.log('data found in redis');
               
               return res.status(200).json( {data : JSON.parse(data)});
            }else{
                console.log('data not found in redis');
                next();
            }
         })
    }
    else{

        next();
    }

    
   
}

function redisDocMiddleware(req, res, next){
    const isSearchRoute = req.url.slice(0,7) === '/search';
    if(isSearchRoute){
       let keyword = 'doc_';
        keyword += req.url.slice(7);
         client.get(keyword, (err, data)=>{
            if(err){
             console.log(err);
             res.status(500).json({error: 'internal server error'});
             return;
            }
            if(data !== null && data !== undefined){
                console.log('data found in redis');
               
               return res.status(200).json( {data : JSON.parse(data)});
            }else{
                console.log('data not found in redis');
                next();
            }
         })
    }
    else{

        next();
    }
}

module.exports.redisUserMiddleware = redisUserMiddleware;
module.exports.client = client;
module.exports.redisDocMiddleware = redisDocMiddleware;