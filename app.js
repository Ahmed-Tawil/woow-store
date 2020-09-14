const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const helmet = require('helmet')
const session = require('express-session')
const app = express();
const { auth, authRole , blockEmp } = require('./helper/auth')


//db config
const db = require('./config/keys').MongoURI;
//connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err));

//
app.use(express.static('public'))
//ejs
app.use('/scripts', express.static(__dirname + '/node_modules/file-upload-with-preview/dist/'));

app.use(expressLayouts);
app.set('view engine', 'ejs');
//bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: 'secrest',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 60 * 60 * 60

  }

}))




// setup messages
app.use(require('connect-flash')());
//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  //delete
  /*
  req.session.user = {}
  req.app.locals.user = req.session.user
  req.session.user.role = 'admin'
 */
  //delete
  next();
})
app.locals.images = []
app.locals.path = ''
//routes
app.use('/user', require('./routes/loginPage'))
app.use(auth)
app.use('/', require('./routes/index'))
app.use('/orders', require('./routes/orders'))
app.use('/products', require('./routes/products'))
app.use('/employees', blockEmp ,require('./routes/employees'))
app.use('/warehouse', blockEmp , require('./routes/warehouse'))
app.use('/reports', authRole('admin'), require('./routes/reports'))
app.use('/constants', blockEmp , require('./routes/constants'))
app.use('/uploads', require('./routes/uploads'))
app.use('/archive', require('./routes/archive'))





const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on ${PORT}`));