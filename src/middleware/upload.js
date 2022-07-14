const multer = require('multer');
// const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'Images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpeg'
    ) {
        cb(null,true);
    } else {
        cb(null,false);
    }
};

// const fileFilter = (req, file, cb) => {
//     if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
//         return cb(new Error('Mohon Upload File jpg/jpeg/png'));
//     }

//     cb(null, true);
// };

const uploads = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = uploads;