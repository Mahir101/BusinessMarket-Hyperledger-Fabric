var express = require('express');
var router = express.Router();
//var csrf = require('csurf');





var path = require('path');

var bcrypt = require('bcrypt-nodejs');

///////////////////////////// || BLOCKCHAIN || ////////////////////////////

var createManufacturer = require('../createManufacterer');
var queryManufacturer = require('../queryManufacturer');
var createProduct = require('../createProduct');
var updateProduct = require('../updateProduct');
var deleteThis = require('../deleteThis');

///////////////////////////// || BLOCKCHAIN || //////////////////////////////


////////////////////multer///////////////////////////////////

var multer = require('multer');
var Storage = multer.diskStorage({
    destination: "./public/Uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});


var upload = multer({
    storage: Storage
}).single('file');



/////////////////////////////multer end/////////////////////////////
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}






module.exports = router;
