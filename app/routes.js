module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
    //RESOURCES SECTION============================
    app.get('/resources', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('resources.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
//UPDATES SECTION=====================
    app.get('/updates', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('updates.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
//FORMS PAGE============================
    app.get('/forms', isLoggedIn, function(req, res) {
        db.collection('orgUploads').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('forms.ejs', {
            user : req.user,
            orgUploads: result
          })
        })
    });
//CONTACTS PAGE========================
    app.get('/contact', isLoggedIn, function(req, res) {
        db.collection('users').find().toArray((err, result) => {
          // let test= db.collection('').find().toArray()
          console.log('hello!!')
          if (err) return console.log(err)
          res.render('contact.ejs', {
            user : req.user,
          })
        })
    });


// LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

//Forms post Request=================================
    app.post('/forms', (req, res) => {
      db.collection('orgUploads').save({name: req.body.name, desc: req.body.desc }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/forms')
        console.log('random message')
        console.log(req.body.desc)
      })

    })

//Contacts=============

// app.put('/contact', (req, res) => {
//   console.log(req)
//   db.collection('users').save({email: req.body.email, organization: req.body.organization}, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/contact')
//   })
//
// })

/// delete============================
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
            successRedirect : '/profile', // redirect to the secure profile section
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
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
