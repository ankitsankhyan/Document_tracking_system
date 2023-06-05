const express = require('express');
const router = express.Router();
const document_controller = require('../controller/document_controller');
router.get('/',(req,res)=>{
    res.send('hello working fine');
})
router.post('/create',document_controller.createdoc);
router.get('/show/:id',document_controller.showAllDocs);
router.delete('/delete/:id',document_controller.deleteDoc);
// update document route
router.put('/update',document_controller.updateDoc);


router.get('/approved/:id',document_controller.approveDoc);
module.exports = router;