'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressHbs = require('express-handlebars');

// var mongoose = require('mongoose');
var session = require('express-session');
// var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
// var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var sellRoutes = require('./routes/seller');
var adminRoutes = require('./routes/admin');



// mongoose.connect('localhost:27017/shopping');
// require('./config/passport');


app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs',



}));
app.set('view engine', '.hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', express.static('public'));
app.use('/admin', express.static('public'));
app.use('/seller', express.static('public'));
app.use('/seller/update', express.static('public'));

app.use('/productdetails', express.static('public'));
app.use('/user/track', express.static('public'));
app.use('/admin/updateTrack', express.static('public'));
app.use('/admin/trackHistory', express.static('public'));
var Cart = require('./models/cart');

var adminExists = require('./adminExist');

app.use(function (req, res, next) {
  
  res.locals.session = req.session;

  next();
});


async function main() {
  try {


    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {

      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return;
    
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    
    const network = await gateway.getNetwork('mychannel');


    const contract = network.getContract('bebshabazar');

   
    var urlencodedParser = bodyParser.urlencoded({ extended: false })



    

   

    app.get('/admin/ledger', async function (req, res) {

      if (adminExists()){
        const result = await contract.evaluateTransaction('queryAllOrder');
        var obj = JSON.parse(result);
        console.log(obj[0]);
        res.render('index', {ob: obj, layout: "layout2.hbs" });
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');


    });

    app.get('/admin/verifyproducts', async function (req, res) {

      if (adminExists()){
        const result = await contract.evaluateTransaction('queryProductAdmin');
        var obj = JSON.parse(result);
        console.log(obj);
        res.render('admin/verifyproducts', {ob: obj, layout: "layout2.hbs" });
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');


    });



    app.post('/admin/verifyproducts/:id', async function (req, res) {

      if (adminExists()){
         await contract.submitTransaction('changeProductAdmin',req.params.id.toString());
        
        res.redirect('/admin/verifyproducts')
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');

    });


    app.get('/admin/ledger', async function (req, res) {

      if (adminExists()){
        const result = await contract.evaluateTransaction('queryAllOrder');
        var obj = JSON.parse(result);
        console.log(obj[0]);
        res.render('index', {ob: obj, layout: "layout2.hbs" });
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');


    });

    app.get('/admin/viewquery', async function (req, res) {

      if (adminExists()){
        const result = await contract.evaluateTransaction('queryAllQueries');
        var obj = JSON.parse(result);
        console.log(obj[0]);
        res.render('admin/viewquery', {ob: obj, layout: "layout2.hbs" });
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');


    });

    app.get('/admin/viewcontact', async function (req, res) {

      if (adminExists()){
        const result = await contract.evaluateTransaction('queryAllContact');
        var obj = JSON.parse(result);
        console.log(obj[0]);
        res.render('admin/viewcontact', {ob: obj, layout: "layout2.hbs" });
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');

    });



    app.post('/admin/updateTrack/:id', urlencodedParser, async function (req, res) {
      if (adminExists()) {
        //var uid = req.body.userid;
        var oid = req.params.id;
        var state = req.body.st;

        var key = oid;
        console.log(req.body.st);
        await contract.submitTransaction('changeOrderState', oid, state);
        
        res.redirect('/admin/ledger');
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!')

    });

    

    app.get('/admin/trackHistory/:id', async function (req, res) {

      if (adminExists()) {
        var result = await contract.evaluateTransaction('getHistoryForTrack', req.params.id.toString());
        
        res.send(result);
      }
      else
        res.send('ADMIN PRIVILEGES NOT ALLOWED. ENROLL AS ADMIN USING BLOCKCHAIN WALLET!');

    });


    var server = app.listen(8000, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log("Example app listening at http://%s:%s", host, port);
    });
   

  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }


  //const adminRoutes = require('./routes/employeeController')
  //app.use('/admin',adminRoutes);
  app.use('/user', userRoutes);
  //app.use('/admin',adminRoutes);
  app.use('/', sellRoutes)
  app.use('/', routes);


  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        layout: "layout2.hbs",
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      layout: "layout2.hbs",
      message: err.message,
      error: {}
    });
  });

  //Full website get requests

  module.exports = app;

}

main();
