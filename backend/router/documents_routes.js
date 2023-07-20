const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authenticaion')
const document_controller = require('../controller/document_controller');
const tags = require('../controller/tag');
const {redisDocMiddleware} = require('../middleware/caching');

//######################################## related to document ########################################
router.post('/create',protect,document_controller.createdoc);
router.get('/show_created_doc', protect,document_controller.created_docs);
router.get('/accessDoc:id',protect,document_controller.getAccessDoc);
router.get('/show:id',document_controller.showAllDocs);
router.delete('/delete:id',protect,document_controller.deleteDoc);
router.put('/update',document_controller.updateDoc);


//######################################## related to authorization ########################################

router.patch('/approved/',protect ,document_controller.approveDoc);
router.patch('/deleteapproval:id',protect,document_controller.removeApproval);
router.get('/verifyapproval:id',protect,document_controller.verifyapproval);
router.patch('/signature:id',protect,document_controller.signature);
router.get('/verifySignatures:id',protect,document_controller.verifySignature);
router.get('/search:keyword',protect,redisDocMiddleware,document_controller.searchDoc);


//######################################## related to tags ########################################
router.patch('/seen:id',protect,tags.mark_as_seen);
router.post('/newTag',protect,tags.addTag);
router.patch('/done:id', protect, tags.mark_as_done);
router.delete('/delete_tag',protect,tags.delete_tag);
router.get('/tagged_doc',protect,document_controller.tagged_docs);
router.get('/get_tags:id',protect,tags.getTags);




//######################################## related to requests ########################################
router.patch('/selectRequest:id',protect,tags.selectRequest);
router.get('/requests',protect,tags.allrequests);



module.exports = router;