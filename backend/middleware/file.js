const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpeg',
  'image/jpg':'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Mime type');
    if(isValid){
      error = null;
    }
    //path is relative to the server.js file
    callback(error, "images");
  },
  filename: (req, file, callback) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name+'-'+ Date.now()+'.'+ext);
  }
});

module.exports = multer({storage:storage}).single("image");
