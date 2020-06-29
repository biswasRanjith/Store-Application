var express = require('express');
var multer = require('multer');
var path = require('path');


var router = express.Router();

const passport = require('passport');

var Store = require('../models/store');
var Product = require('../models/product');
var User = require('../models/user');

router.use(express.static(__dirname+"./public/"));



var Storage= multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');


/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/*User*/
/* GET Home page. */
router.get('/home',isLoggedIn, function(req, res, next) {
    Store.find({userId : req.user.id}, (err,store)=> {
        if(err)
           return done(err, false);
       else if(store){
         res.locals.userName = req.user.google.name;
       res.render('home', {store, user: req.user});
        }
      });
  
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/google/auth', passport.authenticate('google', {  scope: [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/user.phonenumbers.read',
  'https://www.googleapis.com/auth/user.addresses.read',
  'https://www.googleapis.com/auth/user.birthday.read'
] })
);

// the callback after google has authenticated the user
router.get('/google/auth/redirect',
  passport.authenticate('google', {
    successRedirect : '/home',
    failureRedirect : '/'
  })
);

// can be written in separate file like other projects I have done.
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
  {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/');
}

/* Stores */

router.get('/addStore', upload, isLoggedIn, function(req, res, next) {
  res.locals.userName = req.user.google.name;
  res.render('addstore');
});

router.post('/addStore',upload, isLoggedIn, function(req, res, next) {
  res.locals.userName = req.user.google.name;
  var newStore = new Store();
  newStore.name    = req.body.Name;
  newStore.logo = req.file.filename;
  newStore.description  = req.body.Description;
  newStore.category = req.body.Category;
  newStore.userId= req.user.id;

  newStore.save( (err)=> {
      if(err)
      throw err;
      res.redirect('/home');
  });
});


/* product */

router.get('/product:id', isLoggedIn, function(req, res, next) {
  res.locals.userName = req.user.google.name;
 req.session.storeId = req.params.id;
  Product.find( {storeId :req.params.id }, (err,product)=> {
    if(err)
       throw err
   else if(product){

   res.render('product', {product});
    }
   
  });

});

router.get('/product', isLoggedIn, function(req,res,next){
  res.locals.userName = req.user.google.name;
  Product.find({storeId : req.session.storeId}, (err, product) => {
    if(err)
      throw err
      else if(product){
      res.render('product', {product});
    }
  })
})

router.post('/addProduct' ,upload, isLoggedIn, function(req,res, next){
  res.locals.userName = req.user.google.name;
var newProduct = new Product();
newProduct.name    = req.body.Name;
newProduct.image = req.file.filename;
newProduct.description  = req.body.Description;
newProduct.price = req.body.price;
newProduct.storeId= req.session.storeId;

newProduct.save( (err,product)=> {
    if(err)
    throw err;
    res.redirect('/product');
});
})


router.get('/addproduct', isLoggedIn, function(req,res, next) {
  res.locals.userName = req.user.google.name;
  res.render('addProduct');
});

router.get('/profile', isLoggedIn, function(req,res, next) {
  res.locals.userName = req.user.google.name;
  res.render('profile',{user: req.user});
});
module.exports = router;



