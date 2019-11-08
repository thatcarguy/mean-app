const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token,'secret_this_should_be_longer');
    //can add additional data to the request and it gets passed down
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    //calling next let execution continue
    next();
  }catch(error){
    res.status(401).json({message: 'Auth failed no token'});
  }

};
