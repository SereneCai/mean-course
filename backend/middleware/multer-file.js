const MIME_TYPE_MAP ={
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
const storage = multer.diskStorage({
  //destination -- a function that will be executed when try to save a file
  destination: (req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype]; //checking for validity of the file type
    let error = new Error("Invalid image type"); //mimetype is a multer function
    if(isValid){
      error = null;
    }
    cb(error, "backend/images"); //1st paramemter passes an error, the 2nd is the destination
  },
  filename: (req, file, cb)=>{
    const name= file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype]; //to select a mime type from the map
    cb(null, name + '-' + Date.now() + '.' + ext); //constructing name of the file
  }
  //cb = callback
});

module.exports = multer({storage: storage}).single("image");
