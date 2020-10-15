const {ObjectId} = require('mongodb');

module.exports = function(app, passport, db, multer) {

  var storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'public/uploads')
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + ".png")
        }
    });
    var upload = multer({storage: storage});

//=============================NORMAL ROUTES====================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

//===========================PROFILE SECTION ==================================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('profiles').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

//===========================HOME SECTION ==================================
        app.get('/home', isLoggedIn, function(req, res) {
              res.render('home.ejs', {
                user : req.user,

              })
            });
    //
    //
      app.post('/home', upload.single('file-to-upload'), (req, res) => {
        console.log("home email", req)
      db.collection('users').findOneAndUpdate({
          'local.email': req.user.local.email
        }, {
          $set: {
            'local.orgname': req.body.orgname,
            'local.firstname': req.body.firstname,
            'local.lastname': req.body.lastname,
            'local.description': req.body.description,
            'local.profileImg': "uploads/"+ req.file.filename,
          }
        }, {
          sort: {
            _id: -1
          },
          upsert: false
        }, (err, result) => {
          if (err) return res.send(err)
          res.redirect('/home')
        })
    })
    //
    //
    //
//=============================RESOURCES SECTION================================

    app.get('/resources', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('resources.ejs', {
            user : req.user,
            messages: result
          })
        })
    });


//==============================UPDATES SECTION=================================

    app.get('/updates', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('updates.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

//================================FORMS PAGE====================================

    app.get('/forms', isLoggedIn, function(req, res) {
        db.collection('orgUploads').find().toArray((err, result) => {
          if (err) return console.log(err)
          console.log(result)
          res.render('forms.ejs', {
            user : req.user,
            orgUploads: result
          })
        })
    });



      app.post('/forms', upload.single('fileupload'), (req, res, next) => {
          // insertDocuments(db, req, 'uploads/' + req.file.filename, () => {
            db.collection('orgUploads').save(
              {name: req.body.name,
                desc: req.body.desc,
                fileupload: "uploads/"+ req.file.filename }
                , (err, result) => {
              //db.close();
              //res.json({'message': 'File uploaded successfully'});
              res.redirect('/forms')
          });
      // });
});

//============================CONTACTS PAGE=====================================
    app.get('/contact', isLoggedIn, function(req, res) {
        db.collection('users').find().toArray((err, allUsers) => {
          // var orgs = allUsers.filter((e)=>{
          //   if(e[0].organization){
          //
          //   return e[0].organization
          // }
          // })
        
          // let test= db.collection('').find().toArray()
           if (err) return console.log(err)
          res.render('contact.ejs', {
            user : req.user,
            contacts: allUsers

          })
        })
    });
    // app.post('/contact', isLoggedIn, function(req, res) {
    //     db.collection('users').find().toArray((err, allUsers) => {
    //       // let test= db.collection('').find().toArray()
    //       if (err) return console.log(err)
    //       res.render('contact.ejs', {
    //         user : req.user,
    //         contacts: allUsers
    //       })
    //     })
    // });
//============================CHAT PAGE=====================================
    app.get('/chat', isLoggedIn, function(req, res) {

           db.collection('users').findOne({_id:ObjectId(req.query.otherUserId)},(err, otherUser) =>{

          // if (err) return console.log(err)
          console.log("Creating new chat", req.user._id, req.query.otherUserId )
          res.render('chat.ejs', {
            user : req.user,
            otherUserId: req.query.otherUserId,
            firstMsg :req.query.firstMsg,
            otherUser: otherUser
          })
        })
    });

    app.post('/chat', isLoggedIn, function(req, res) {

           db.collection('messages').save({_id:ObjectId(req.query.otherUserId)},(err, otherUser) =>{

          // if (err) return console.log(err)
          console.log("Creating new chat", req.user._id, req.query.otherUserId )
          res.render('chat.ejs', {
            user : req.user,
            otherUserId: req.query.otherUserId,
            firstMsg :req.query.firstMsg,
            otherUser: otherUser
          })
        })
    });






    // app.put('/contact', function (req, res) => {
    //   db.collection('users').findOne({email: req.body.name, organization: rq.body.org}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.send('/contact')
    //   })
    //
    // })

//=================================LOGOUT=======================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

//=================================DELETE=======================================
    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        //CLIENT SIGNUP====================================
        // show the signup form
        app.get('/clientsignup', function(req, res) {
            res.render('clientsignup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/clientsignup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/clientsignup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.local.organization = undefined;
        user.save(function(err) {
            res.redirect('/home');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
