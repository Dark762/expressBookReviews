const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();
app.use(express.json());
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.use("/customer/auth/*", function auth(req,res,next){
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (autheticatedUser(username, password)) {
        let accesstoken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

        //req.session.authorization = { accesstoken, username };

        res.set('Authorization', accesstoken);

        return res.status(200).send("User Successfully logged in");

    } else {
        return res.status(208).json({ message: "Invalid Login" });
    }

});


const autheticatedUser = (username, password) => {
    let validateUsers = users.filter((user) => {
        return user.username == username;
    });

    if (validateUsers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}
 
const PORT =5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.listen(PORT,()=>console.log("Server is running"));