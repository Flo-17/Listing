let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
const Message = require('./models/message');
const cookieParser = require('cookie-parser');
const User = require('./models/user');

require('dotenv').config({path: './config/.env'})
let app = express();

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

// Moteur de template
app.set('view engine' , 'ejs')

// Middleware
const oneDay = 1000 * 60 * 60 * 24;
app.use('/assets', express.static('public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ urlencoded : false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge : oneDay }
  }))
app.use(require('./middlewares/flash'))

// Routes
app.get('/', (request,response) =>{
    
    let Message = require('./models/message')
    Message.all(function(messages) {

        response.render('pages/index', {messages: messages})

    })
})

app.post('/', (request,response) =>{

    session = request.session
    if(session.userid){      
            res.send("Welcome User");       
            }
    else{
        if(request.body.message === undefined || request.body.message === ''){
            request.flash('errorPost', "Vous n'avez pas entré de message.")    
            response.redirect('/')    
            }
        else{
            let Message = require('./models/message')
            Message.create(request.body.message, function() {
                request.flash('success', "Merci !")
                response.redirect('/')
                })
            }
        }
})

app.get('/message/:id', (request, response) => {
    
    let Message = require ('./models/message')

    Message.find(request.params.id, function (message) { 
        response.render('messages/show', {message: message} )
    })
})

app.get('/login', (request, response) => {
    
    response.render('pages/login')
})

app.post('/login', (request, response) => {

    const {email, password} = request.body;
    let errorsLogin = [];
    if(!email || !password) {
        request.flash('error', "Veuillez remplir tous les champs.")  
        errorsLogin.push({msg : "Veuillez remplir tous les champs."});
    }
    
    if(errorsLogin.length > 0 )
    {
        response.render('pages/login', {
            errorsLogin : errorsLogin,
            email : email,
            password : password})
    }
    
    if(email && password){
        let User = require('./models/user')
        User.connecting(email,password, function(user) {
            if (user.row === undefined)
            {  
                request.flash('error', "E-mail ou mot de passe incorrect !")  
                errorsLogin.push({msg : "E-mail ou mot de passe incorrect !"}); 
                response.render('pages/login', {
                    errorsLogin : errorsLogin,
                    email : email,
                    password : password})
            } 
            else
            {               
                session = request.session;
                session.userid = email;
                console.log(request.session)
                response.redirect('/')
            }             
        })
    }
})

app.get('/register', (request, response) => {

    response.render('pages/register')
})

app.post('/register', (request, response) => {

    const {name,email, password, password2} = request.body;
    let errorsRegister = [];
    if(!name || !email || !password || !password2) {
        request.flash('error', "Veuillez remplir tous les champs.")  
        errorsRegister.push({msg : "Veuillez remplir tous les champs."});
    }
    //check if match
    if(password !== password2) {
        request.flash('error', "Les mots de passe ne correspondent pas.")  
        errorsRegister.push({msg : "Les mots de passe ne correspondent pas."});
    }
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        request.flash('error', "Le mot de passe nécéssite 6 caractères minimum.")  
        errorsRegister.push({msg : "Le mot de passe nécéssite 6 caractères minimum."});
    }
    if(errorsRegister.length > 0 ) {
        response.render('pages/register', {
            errorsRegister : errorsRegister,
            name : name,
            email : email,
            password : password,
            password2 : password2})
        } 
        else {        
            //validation passed
            let User = require('./models/user')
            User.exist(email, function(user) {  
            if (user.row != undefined){  
                request.flash('error', "E-mail déja enregistré.")  
                errorsRegister.push({msg : "E-mail déja enregistré."}); 
                response.render('pages/register', {
                    errorsRegister : errorsRegister,
                    name : name,
                    email : email,
                    password : password,
                    password2 : password2})
                } 
            else{
                User.create(name, email, password, function() {
                response.redirect('login')
                })
            }    
            
        })
    }
})