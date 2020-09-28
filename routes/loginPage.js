const express = require('express');
const Users = require('../models/users')

const router = express.Router();

const homeRedirect = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/')
  }
  next()
}
//welcome page
router.get('/login', homeRedirect, async (req, res) => {

  // console.log(await Users.find());
  res.render('loginPage', { layout: false })
});

router.get('/logout', async (req, res) => {
  req.session.destroy()
  res.clearCookie(req.sessionID);
  res.redirect('/user/login')
});

router.post('/login', homeRedirect, async (req, res) => {
  const { email, password } = req.body

  const user = await Users.findOne({ email: email, password: password })
  if (user !== null) {
    req.session.user = user
    //console.log( req.app.locals.user);
    res.redirect('/')
  } else {
    req.flash('error_msg', 'البيانات غير متطابقة لدينا!')
    res.redirect('/user/login')

  }
});



module.exports = router;