let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
const Message = require('./models/message');

require('dotenv').config({path: './config/.env'})
let app = express();

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

// Moteur de template
app.set('view engine' , 'ejs')

// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ urlencoded : false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
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

    if(request.body.message === undefined || request.body.message === '')
    {
        request.flash('errorPost', "Vous n'avez pas entré de message.")    
        response.redirect('/')    
    }
    else
    {
        let Message = require('./models/message')
        Message.create(request.body.message, function() {
            request.flash('success', "Merci !")
            response.redirect('/')
        })
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

app.get('/register', (request, response) => {

    response.render('pages/register')
})

app.post('/register', (request, response) => {

    const {name,email, password, password2} = request.body;
    let errors = [];
    if(!name || !email || !password || !password2) {
        request.flash('error', "Veuillez remplir tous les champs.")  
        errors.push({msg : "Veuillez remplir tous les champs."});
    }
    //check if match
    if(password !== password2) {
        request.flash('error', "Les mots de passe ne correspondent pas.")  
        errors.push({msg : "Les mots de passe ne correspondent pas."});
    }
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        request.flash('error', "Le mot de passe nécéssite 6 caractères minimum.")  
        errors.push({msg : "Le mot de passe nécéssite 6 caractères minimum."});
    }
    if(errors.length > 0 ) {
        response.render('pages/register', {
            errors : errors,
            name : name,
            email : email,
            password : password,
            password2 : password2})
        } 
        else {        
            //validation passed
            let User = require('./models/user')
            User.exist(request.body.email, function(user) {  
            if (user.row != undefined){  
                request.flash('error', "E-mail déja enregistré.")  
                errors.push({msg : "E-mail déja enregistré."}); 
                response.render('pages/register', {
                    errors : errors,
                    name : name,
                    email : email,
                    password : password,
                    password2 : password2})
                } 
            else{
                User.create(request.body.name, request.body.email, request.body.password, function() {
                response.redirect('login')
                })
            }    
            
        })
    }
})