//3. party moduller
const express = require('express'); 
const mongoose = require('mongoose'); 
const fileUpload = require('express-fileupload'); 
const methodOverride = require('method-override'); //tarayıcı üzerinde put request olmadığından post request üzerinden yapabilmek için kullanıyoruz
const config = require('./config');

//çekirdek moduller
const ejs = require('ejs');

//kendi oluşturduğumuz moduller
const photoControllers = require('./controllers/photoControllers'); //controllers ları almak 
const pageControllers = require('./controllers/pageControllers');

const app = express();

//connect db
mongoose.connect(`mongodb+srv://${config.USER_ID}:${config.USER_KEY}@cluster0.c5t4oaw.mongodb.net/?retryWrites=true&w=majority`,//'mongodb://127.0.0.1:27017/pcat-test-db`, 
{                
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false
}).then(() => {
  console.log(process.env)
  console.log('DB CONNECTED')
  
}).catch((err) => {
  console.log(err)
})

//Template engine
app.set('view engine', 'ejs');

//Middlewares
app.use(express.static('public')); //projemizin statik dosyaları public klasörü altında
app.use(express.urlencoded({ extended: true })); //photo ekleme req-res döngüsü sonlandırma için kullandık (url deki datayı okumaya yarıyor.)
app.use(express.json()); //photo ekleme req-res döngüsü sonlandırma için kullandık. ( url deki datayı json a çeviriyor)
app.use(fileUpload()); //express file upload middleware
app.use(methodOverride('_method' , {
  methods:['POST', 'GET'] //hangi methodların gerektiğinde override yapılmasını belirttik. html PUT VE DELETE requesti bu methodları override yaparak kullanıyor.
})); 

//Routes
app.get('/', photoControllers.getAllPhotos); //list all photo
app.get('/photos/:id', photoControllers.getPhoto); //get a photo
app.post('/photos', photoControllers.createPhoto); //add a photo
app.put('/photos/:id', photoControllers.updatePhoto); //update a photo info
app.delete('/photos/:id', photoControllers.deletePhoto); //delete a photo

app.get('/about', pageControllers.getAboutPage);
app.get('/add', pageControllers.getAddPage);
app.get('/photos/edit/:id', pageControllers.getEditPage);



const port = process.env.PORT || 5000; //3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});

