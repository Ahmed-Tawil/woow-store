const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/user/login')
    }
    next()
}

const authRole = (role)=>{
    return (req, res, next) => {
        if (req.session.user.role !== role) {
            return res.redirect('/')
        }
        next()
    }
}

const blockEmp = (req, res, next) => {
    if (req.session.user.role == 'emp') {
        return res.redirect('/')
    }
    next()
}


module.exports = {
    auth ,
    authRole,
    blockEmp
}