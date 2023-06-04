const Document = require("../Model/Document");
const Tag  = require("../Model/Tag");

module.exports.createdoc = async (req, res) => {
  const title = req.body.name;
  const author = req.body.author;
  const description = req.body.description;
  const newDoc = await Document.create({
    title,
    author,
    description,
  });
  res.status(200).json({
    data: newDoc,
  });
};


module.exports.showAllDocs = async (req, res) => {
  const id = req.params.id;
  
  const docs = await Document.findById(id);

  res.status(200).json({
    data: docs,
  });
};


modules.exports.deleteDoc = async (req, res) => {
  const id = req.params.id;
  c

  const doc = await Document.findByIdAndDelete(id);
  res.status(200).json({
    data: doc,
  });
};


module.exports.updateDoc = async (req, res) => {
  //   document id
  // user id
    
  try {
  
    const id = req.params.id;

    const doc = await Document.findById(id);

    doc.approve = !doc.approve;

    doc.save();
  } catch (e) {
    req.status(404).json({
      message: "Doc is not found",
    });
  }

  res.status(200).json({
    data: doc,
  });
};


module.exports.approveDoc = async (req, res) => {
  const id = req.params.id;
  const doc = await Document.findByIdAndUpdate(id, {
    approved: true,
  });
  res.status(200).json({
    data: doc,
  });
};


module.exports.searchDoc = async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const documents = await Document.find({ 
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });

    res.status(200).json({
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while searching for documents.'
    });
  }
};

