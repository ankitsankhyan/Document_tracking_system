const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authenticaion')
const document_controller = require('../controller/document_controller');
const tags = require('../controller/tag');

router.delete('/',(req,res)=>{
    res.status(200).json({
        message:'working fine'
    })  })



router.post('/create',protect,document_controller.createdoc);
router.get('/show_tagged_doc',protect,document_controller.tagged_docs);
router.get('/show_created_doc', protect,document_controller.created_docs);
router.patch('/seen:id',protect,tags.mark_as_seen);
router.post('/newTag',protect,tags.addTag);
router.patch('/done', protect, tags.mark_as_done);
router.delete('/delete_tag',protect,tags.delete_tag);
router.get('/show:id',document_controller.showAllDocs);
router.delete('/delete:id',protect,document_controller.deleteDoc);
// update document route
router.put('/update',document_controller.updateDoc);
// approve document route
router.get('/approved/:id',document_controller.approveDoc);
// search doc route
router.get('/search/:id',document_controller.searchDoc);

// sign the document
router.get('/sign/',document_controller.signature);
module.exports = router;