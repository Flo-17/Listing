let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
const Message = require('./models/message');
const { request } = require('express');

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
        request.flash('error', "Vous n'avez pas entré de message.")    
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
        request.flash('error', "Vous n'avez pas entré de message.")  
    }
    //check if match
    if(password !== password2) {
        request.flash('error', "Vous n'avez pas entré de message.")  
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        request.flash('error', "Vous n'avez pas entré de message.")  
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
            user = User.exist(request.body.email, function() {  
            if(user) {
                request.flash('error', "E-mail déja enregistré.")  
                render(response,errors,name,email,password,password2);
                
               } else {
                User.create(request.body.email, request.body.password, function() {
                response.redirect('login')
                })
            }    
        })
        console.log(' Name ' + name+ ' email :' + email+ ' passw:' + password);
        response.redirect('login')
    }
})