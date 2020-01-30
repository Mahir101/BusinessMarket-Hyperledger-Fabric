var express = require('express');
var router = express.Router();

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

router.get('/seller/login', function (req, res, next) {

    var messages = req.flash('error');
    res.render('Outlets/login', { layout: 'layout.hbs', messages: messages, hasErrors: messages.length > 0 });

});

router.post('/seller/login', async function (req, res, next) {

    var email = req.body.email;
    var pass = req.body.password;

    var resx = await queryManufacturer(email);

    console.log("resx er value" + resx);

    var jsonObj = JSON.parse(resx);

    console.log("ki hocche?" + jsonObj);

    if (jsonObj.length != 0 && bcrypt.compareSync(pass, jsonObj[0].Record.Password)) {
        // console.log("post signin   "+resx);
        req.session.memail = email;
        req.session.mpass = pass;
        res.redirect('/seller');
    }
    else {
        req.flash('error','Incorrect Login Information');
        res.redirect('/seller/login');
    }

});

router.get('/seller/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('Outlets/signup', { layout: 'layout.hbs', messages: messages, hasErrors: messages.length > 0 });
});




router.post('/seller/signup', async function (req, res, next) {

    var email = req.body.email;
    var name = req.body.name;
    var pass = req.body.password;

    var password = bcrypt.hashSync(pass, bcrypt.genSaltSync(5), null);
    var phone = req.body.phone;
    var address = req.body.address;

    var key = makeid(20);
    var resx = await queryManufacturer(email);
    var obj = JSON.parse(resx);
    if(obj.length!=0){
        req.flash('error', 'Email already exists!! ');
        res.redirect('/seller/signup');
        return;
    }
   
    createManufacturer(key.toString(), name.toString(), email.toString(), password.toString(), phone.toString(), address.toString());

    res.redirect('/seller/login');
});

router.post('/seller/logout', function (req, res, next) {
    if (req.session.memail) {
        req.session.memail = null;
        res.redirect('/');
    }
    else
        res.redirect('/seller/login');
});


router.get('/seller/add', function (req, res, next) {
    if (!req.session.memail)
    {
        res.redirect('/seller/login');
        return;
    }
    res.render('Outlets/add', { layout: "layout.hbs", title: 'Add Product' });
});

router.post('/seller/add', upload, async function (req, res, next) {

    if (!req.session.memail)
        return res.redirect('/seller/login');

    var manid = req.session.memail;
    var img1 = req.file.filename;
    var img2 = req.file.filename;
    var img3 = req.file.filename;
    var title = req.body.title;
    var desc = req.body.description;
    var price = req.body.price;
    var avail = req.body.avail;
    var cat = req.body.category;
    var feat = req.body.featured;

    
    var key = makeid(23);

    createProduct(key.toString(), manid.toString(), img1.toString(), img2.toString(), img3.toString(), title.toString(), desc.toString(), price.toString(), avail.toString(), cat.toString(), feat.toString());

    req.flash('success', 'Successfully Added product!');
    res.redirect('/seller');
});

var querySingleProduct = require('../querySingleProduct')

router.get('/seller', async function (req, res, next) {
    if (!req.session.memail) {
        res.redirect('/seller/login');
        return;

    }

    var em = req.session.memail;
    var pro = await querySingleProduct(em);
    var obj = JSON.parse(pro);

    res.render('Outlets/products', { prods: obj, title: 'Seller Products' });


});

var querySingleProductID = require('../querySingleProductID');

router.get('/seller/update/:id',async function (req, res, next) {
    if (!req.session.memail) {
        res.redirect('/seller/login');
        return;

    }

    var result = await querySingleProductID(req.params.id);
    var doc = JSON.parse(result);
    res.render('Outlets/update', { prods: doc, layout: "layout.hbs", title: 'Update' });

});

router.post('/seller/update/:id', upload, async function (req, res, next) {
    if (!req.session.memail) {
        res.redirect('/seller/login');
        return;

    }

    //console.log(req.params.id);
    var manid = req.session.memail;
    var img1 = req.file.filename;
    var img2 = req.file.filename;
    var img3 = req.file.filename;
    var title = req.body.title;
    var desc = req.body.description;
    var price = req.body.price;
    var avail = req.body.avail;
    var cat = req.body.category;
    var feat = req.body.featured;
    var key = req.params.id;

    updateProduct(key.toString(), manid.toString(), img1.toString(), img2.toString(), img3.toString(), title.toString(), desc.toString(), price.toString(), avail.toString(), cat.toString(), feat.toString());
    res.redirect('/seller');

});


router.get('/seller/delete/:id', async function (req, res, next) {
    if (!req.session.memail) {
        res.redirect('/seller/login');
        return;
    }
    deleteThis(req.params.id);
    res.redirect('/seller');

});

module.exports = router;
