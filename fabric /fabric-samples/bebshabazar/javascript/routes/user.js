var express = require('express');
var router = express.Router();



var Cart = require('../models/cart');

var path = require('path');

var bcrypt = require('bcrypt-nodejs');


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


///////////////////////////////////BLOCKCHAIN/////////////////////////////////
//var createProduct = require('../createProduct');
var createUser = require('../createUser');
var queryUser = require('../queryUser');
var updateUser = require('../updateUser');
//var invoke = require('../invoke');
//var createOrder = require('../queryOrder');


///////////////////////////////////BLOCKCHAIN/////////////////////////////////


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


var querySingleOrderID = require('../querySingleOrderID');

router.get('/track/:id', async function (req, res, next) {
    if(!req.session.email)
    {
        req.flash('error','Please login');
        res.redirect('/');
        return;
    }
    var idx = req.params.id;

    var result = await querySingleOrderID(idx.toString());
    

    try {
      const obj = JSON.parse(result);
      console.log("OBJ: "+obj[0].Record.State);
      res.render('track', {layout:"tlayout.hbs", uuid:obj[0].Key,date:obj[0].Record.Date, trk: obj[0].Record.State, title: 'Tracking your Product' });
    }
    catch (e) {
      console.log("not in the blockchain database");
      //req.flash('this order is not yet tracked by admin in blockchain');
      res.redirect('/user/orders');

    }

  });

  


  var querySingleOrder = require('../querySingleOrder');
router.get('/orders', async function (req, res, next) {

    if(!req.session.email)
    {
        req.flash('error','Please login');
        res.redirect('/user/signin');
        return;
    }
    var resx = await querySingleOrder(req.session.email);
    var obj =  JSON.parse(resx);

    for(var i=0 ; i<obj.length; i++){
        obj[i].Record.ItemName = JSON.parse(obj[i].Record.ItemName);
    }
   
    res.render('user/orders', { layout: 'layout.hbs', orders: obj });
    
});



router.get('/profile', async function (req, res, next) {
    
    if (req.session.email) {
        var resx = await queryUser(req.session.email, req.session.pass);
        var obj = JSON.parse(resx);
        res.render('user/profile', { info: obj[0].Record });
    }
    else
        res.redirect('/user/signin');

});

router.get('/editprofile', async function (req, res, next) {

    if (req.session.email) {
        var resx = await queryUser(req.session.email, req.session.pass);
        var obj = JSON.parse(resx);
        res.render('user/editprofile', { info: obj[0].Record });
    }
    else
        res.redirect('/user/signin');

});

router.post('/editprofile', upload, async function (req, res, next) {

    if(!req.session.email)
    {
        req.flash('error','Please login');
        res.redirect('/');
        return;
    }

    var name = req.body.name;
    var image = req.file.filename;
    var age = req.body.age;
    var city = req.body.city;
    var country = req.body.country;
    var gender = req.body.gender;
    var phone = req.body.phone;



    if (req.session.email) {
        var resx = await queryUser(req.session.email, req.session.pass);
        var obj = JSON.parse(resx);
        var xx = obj[0].Key;

        updateUser(xx.toString(), name.toString(), image.toString(), age.toString(), city.toString(), country.toString(), gender.toString(), phone.toString());

        res.redirect('/user/profile')
    }
    else
        res.redirect('/user/signin');
});


router.get('/logout', function (req, res, next) {
    //req.logout();
    if (req.session.email) {
        req.session.email = null;
        res.redirect('/');


    }
    else
        res.redirect('/user/signin');
});

router.use('/', function (req, res, next) {
    next();
});


router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { layout: 'layout.hbs', messages: messages, hasErrors: messages.length > 0 });
});






router.post('/signup', upload, async function (req, res, next) {

    var email = req.body.email;
    var name = req.body.name;
    var pass = req.body.password;

    var password = bcrypt.hashSync(pass, bcrypt.genSaltSync(5), null);

    var image = req.file.filename;

    var age = req.body.age;
    var city = req.body.city;
    var country = req.body.country;
    var gender = req.body.gender;
    var phone = req.body.phone;

    var resx = await queryUser(email);
    var Obj = JSON.parse(resx);

    if(Obj.length!=0){
        req.flash('error','Email already exists!')
        res.redirect('/user/signup');
        return;
    }




    var key = makeid(24);

    createUser(key.toString(), name.toString(), email.toString(), password.toString(), image.toString(), age.toString(), city.toString(), country.toString(), gender.toString(), phone.toString());


    res.redirect('/user/signin');

});

router.get('/signin', function (req, res, next) {
    
    var messages = req.flash('error');
    res.render('user/signin', { layout: 'layout.hbs', messages: messages, hasErrors: messages.length > 0 });
});



router.post('/signin', async function (req, res, next) {
    
    var email = req.body.email;
    var pass = req.body.password;

    var resx = await queryUser(email);
    

    var jsonObj = JSON.parse(resx);


    console.log("ki hocche?" + jsonObj);

    if (jsonObj.length != 0 && bcrypt.compareSync(pass, jsonObj[0].Record.Password) ) {
        // console.log("post signin   "+resx);
        req.session.email = email;
       // req.session.pass = pass;
        res.redirect('/user/profile');
    }
    else {
        req.flash('error','Incorrect Login Information');
        res.redirect('/user/signin');
    }
});


module.exports = router;
