User.findOne({ email: { 
    "$regex": "^" + email + "\\b", "$options": "i"
}}, function (err, user) {
    if (user) {
        res.render('register', {
            user: user,
            
        });
    }
    else {
        var newUser = new User({
            FirstName: FirstName,
            LastName: LastName,
            email: email,            
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });
 req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/login');
    }
});