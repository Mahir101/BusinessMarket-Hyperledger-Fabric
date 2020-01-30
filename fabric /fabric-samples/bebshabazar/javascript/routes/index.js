var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var queryAllProduct = require('../queryAllProduct');


/* GET home page. */
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var queryProductSearch = require('../queryProductSearch');

router.post('/search', async function (req, res, next) {
    var qs = req.body.searchit;
    var successMsg = req.flash('success')[0];
    var result = await queryProductSearch(qs.toString());
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Search page', products: productChunks, successMsg: successMsg, noMessages: !successMsg });

});

router.get('/', async function (req, res, next) {

    var successMsg = req.flash('success')[0];
    var result = await queryAllProduct();
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Home page', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

var qc = require('../queryProductCategory');

router.get('/agro', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('AGRICULTURAL');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Home page', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

router.get('/household', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('HOUSEHOLD');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Home page', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

router.get('/tools', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('TOOLS');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Home page', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

router.get('/toys', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('TOYS');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Home page', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

router.get('/utensils', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('UTENSILS');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Utensils', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

router.get('/men_clothings', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('MCLOTHINGS');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Men-Clothings', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

router.get('/women_clothings', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var result = await qc('WCLOTHINGS');
    var doc = JSON.parse(result);
    console.log(doc);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < doc.length; i += chunkSize) {
        productChunks.push(doc.slice(i, i + chunkSize));
    }
    res.render('web/index', { title: 'Women-Clothings', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
});

var pr = require('../queryProductRange');

router.post('/product_range', async function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var varx = req.body.stx;
    var vary = req.body.endy;
    console.log("DEBUG: "+varx+" "+ vary);
    if (varx < vary) {


        var successMsg = req.flash('success')[0];
        var result = await pr(varx.toString(), vary.toString());
        var doc = JSON.parse(result);
        console.log(doc);
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < doc.length; i += chunkSize) {
            productChunks.push(doc.slice(i, i + chunkSize));
        }
        res.render('web/index', { title: 'Product Range ', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    }
    else {
        req.flash('error','Enter correct range');
        res.redirect('/');
    }
});






/*basic pages*/


router.get('/about', function (req, res, next) {
    res.render('web/about', { title: 'About' });
});


router.get('/contact', function (req, res, next) {
    res.render('web/contact', { title: 'Contact' });
});

var cont = require('../createContact');
router.post('/contact', async function (req, res, next) {

    var key = makeid(10);
    cont(key, req.body.name, req.body.email, req.body.message);

    res.redirect('/contact');
});

var getdis = require('../querySingleDiscussion');
var getpis = require('../querySingleProductID');

router.get('/productdetails/:id', async function (req, res, next) {


    try {
        var idx = req.params.id;
        var dis = await getdis(idx.toString());
        var obj1 = JSON.parse(dis);

        var pis =  await getpis(idx.toString());
        var obj2 = JSON.parse(pis);

        res.render('web/productdetails', { proid: idx, dis: obj1, log: req.session.email, prods: obj2, title: 'Product Details' });
    } catch (e) {
        console.log(e);
        res.send("ERROR!!!");
    }

});





router.get('/faqs', function (req, res, next) {
    res.render('web/faqs', { title: 'Frequently Asked Questions' });
});

router.get('/help', function (req, res, next) {
    res.render('web/help', { title: 'Help page' });
});
var qq = require('../createQueries');

router.post('/help', async function (req, res, next) {
    if (!req.session.email) {
        req.flash('error', 'Please log in');
        res.redirect('/');
    }
    var key = makeid(11);
    qq(key, req.session.email, req.body.message);
    res.redirect('back');
});

// router.get('/checkoutnow', function (req, res, next) {
//     res.render('web/checkoutnow', { title: 'Checkout' });
// });

// router.get('/payment', function (req, res, next) {
//     res.render('web/payment', { title: 'Payment Options' });
// });



router.get('/privacy', function (req, res, next) {
    res.render('web/privacy', { title: 'Privacy' });
});

router.get('/terms', function (req, res, next) {
    res.render('web/terms', { title: 'Terms and Regulations' });
});


/*basic pages*/

router.get('/add-to-cart/:id', async function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var result = await getpis(productId);
    var product = JSON.parse(result);
    console.log("DEBUG: "+ product[0]);

    cart.add(product[0], product[0].Key);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');

});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/Cart');
});

router.get('/increase/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.increaseByOne(productId);
    req.session.cart = cart;
    res.redirect('/Cart');
});





router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/Cart');
});

router.get('/Cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('web/Cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    console.log(cart);
    res.render('web/Cart', { products: cart.generateArray(), layout: "layout.hbs", totalPrice: cart.totalPrice });
});

router.get('/checkout', function (req, res, next) {
    if (!req.session.cart && !req.session.email) {
        return res.redirect('/Cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { layout: "layout.hbs", total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});


var createOrder =  require('../createOrder');
router.post('/checkout', async function (req, res, next) {
    if (!req.session.cart || !req.session.email) {
      res.redirect('/Cart');
      return; 
    }

    var cart = new Cart(req.session.cart);
    
    console.log("THIS IS CART 1");
    console.log(cart);

    var item = JSON.stringify(cart.items);
    var qty =  cart.totalQty;
    var total = cart.totalPrice;

    console.log("DEBUG: "+item);
    


    var key = makeid(26);
    var uid = req.session.email;
    createOrder(key.toString(),uid.toString(),item.toString(),qty.toString(),total.toString(), req.body.address.toString(), req.body.name.toString(),req.body.delivery.toString(), '1');
    
    req.flash('success', 'Successfully ordered product!');
    req.session.cart = null;

    res.redirect('/');
    

  });



var createDiscussion = require('../createDiscussion');
router.post('/discuss/:id', async function (req, res, next) {
    // var key=makeid(18);
    var proid = req.params.id;
    var uid;
    if (req.session.email) {
        uid = req.session.email;
    }
    else {
        uid = req.session.memail;
    }

    var str = req.body.comx;

    console.log("HELLO STR: " + str);

    var key = makeid(17);


    createDiscussion(key, proid.toString(), uid.toString(), str.toString());

    res.redirect('/productdetails/' + req.params.id);

});


module.exports = router;

