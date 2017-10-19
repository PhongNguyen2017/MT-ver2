var mongoose = require('mongoose'), ejs = require('ejs')

var Product = require('../Models/product.js');

var User = require('../Models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var express=require('express');

module.exports = function(app) {


    app.get('/Product', (req, res) => {
        ejs.renderFile('./view/Product.ejs', {}, (err, html) => {
            res.end(html);
        });
    });


    app.get('/ProductList', function(req, res) {

     

        //----------HAM TIM KIEM THEO TEN------------------------//
        
        if(req.query.search && req.query.search.length > 0){
        
         Product.find({name: {$regex: ".*" + req.query.search + "*"}}, function(err, products) {
             if (err)
                  res.send(err);
                    ejs.renderFile('./view/ProductList.ejs', {products}, (err, html) => {
                         res.end(html);
                           });
                      });
            return ;
            

        }

        //-----------------HAM TIM KIEM THEO KHOANG GIA --------------------------//




        if(req.query.minprice && req.query.maxprice){
            console.log('chay dc if seach');

            var queryFP = req.query.minprice;
            var queryLP = req.query.maxprice;


            console.log('start find');
            Product.find({}).where('price').gt(queryFP-1).lt(queryLP+1).exec((err, products)=> {
              
                console.log('khong co loi nhung ko chay dc')
                ejs.renderFile('./view/ProductList.ejs', {products }, (err, html) => {
                    res.end(html);
                });

            });
          



        }


        

            console.log('ko chay dc if');
            Product.find(function(err,products){
                ejs.renderFile('./view/ProductList.ejs',{products},(err, html) => {
                    res.end(html)
                })
            })  

    

        });





    //---------------------------------POST Product---------------------------------------------



    app.post('/Product', (req, res,done) => {
        const tmp = req.body;
        var errMes = "";

        if (!tmp.name) {
            errMes += " Enter Product's Name. Please !!!";

        }
        if (!tmp.description) {
            errMes += " Enter Product's description. Please!!! ";
        }
        if (!tmp.price) {
            errMes += " Enter Product's price. Please!!! ";
        }
        if (!tmp.status) {
            errMes += " Enter Product's status. Please!!! ";
        }
        if (!tmp.price) {
            errMes += " Enter Product's proType. Please!!! ";
        }
        if (errMes) {
            ejs.renderFile('./view/Product.ejs', { errMes: errMes }, (err, html) => {
                res.end(html);
            });
        }

         else {
            var newProduct = new Product();
            newProduct.name = req.body.name;
            newProduct.description = req.body.description;
            newProduct.price = req.body.price;
            newProduct.status = req.body.status; 
            newProduct.proType = req.body.proType;
            newProduct.save(function(err){
        if (err)
        return ejs.renderFile('./view/Product.ejs', { errMes: err.message }, (err, html) => {
                res.end(html);
            });

      res.redirect('/Product');
            })
        }
        
    });



  //----------------Ham Delete Product theo ID-----------------------//  


app.delete('/ProductList/:_id', function(req, res){
    Product.findByIdAndRemove({_id: req.params._id}, 
       function(err, docs){
        if(err) res.json(err);
        else    res.redirect('/ProductList');
    });
});

//---------------------------------------------------//




app.get('/', function(req, res, next) {
    Product.find(function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  });


//------------------------------------------


app.get('/list', function(req, res, next) {
    Product.find(function (err, result) {
      if (err) return next(err);
       ejs.renderFile('./view/ProductList.ejs', {result: result}, (err, html) => {
            res.end(html);
        });
    });
  });


//------------------------- User Module - Phong -----------------------

// Get Homepage
app.get('/', ensureAuthenticated, function(req, res){
	res.render('/ProductList');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/route/login');
	}
}
  // Register

app.get('/Register', (req, res) =>{
  ejs.renderFile('./view/register.ejs',{}, (err, html) => {
    res.end(html);
  });
  
});

// Login
app.get('/Login', (req, res) =>{
  ejs.renderFile('./view/login.ejs',{}, (err, html) => {
    res.end(html);
  });
	
});


// Register User
// app.post('/Register', function(req, res){
// 	var name = req.body.name;
//     var email = req.body.email;
//     var phone = req.body.phone;
// 	var username = req.body.username;
// 	var password = req.body.password;
// 	var password2 = req.body.password2;

// 	// Validation
// 	req.checkBody('name', 'Name is required').notEmpty();
// 	req.checkBody('email', 'Email is required').notEmpty();
//     req.checkBody('email', 'Email is not valid').isEmail();
//     req.checkBody('phone','Phone number is required').notEmpty();
// 	req.checkBody('username', 'Username is required').notEmpty();
// 	req.checkBody('password', 'Password is required').notEmpty();
// 	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

// 	var errors = req.validationErrors();

// 	if(errors){
// 		res.renderFile('./view/register.ejs',{}, (err, html) =>{
// 			errors:errors,
//             res.end(html);
// 		});
// 	} else {
// 		var newUser = new User({
// 			name: name,
//             email:email,
//             phone:phone,
// 			username: username,
//             password: password,
            
// 		});

// 		User.createUser(newUser, function(err, user){
// 			if(err) throw err;
// 			console.log(user);
// 		});

// 		req.flash('success_msg', 'You are registered and can now login');

// 		res.redirect('./route/Login');
// 	}
// });

// Authentication
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//    User.getUserByUsername(username, function(err, user){
//    	if(err) throw err;
//    	if(!user){
//    		return done(null, false, {message: 'Unknown User'});
//    	}

//    	User.comparePassword(password, user.password, function(err, isMatch){
//    		if(err) throw err;
//    		if(isMatch){
//    			return done(null, user);
//    		} else {
//    			return done(null, false, {message: 'Invalid password'});
//    		}
//    	});
//    });
//   }));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.getUserById(id, function(err, user) {
//     done(err, user);
//   });
// });

app.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/route/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/route/login');
});




};



