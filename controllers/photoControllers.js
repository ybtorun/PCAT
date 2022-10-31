//çekirdek moduller
const fs = require('fs');
//kendi oluşturduğumuz moduller
const Photo = require('../models/Photo'); //kendi oluşturduğumuz mongo db için photo modeli

//mongodb den tüm photo bilgilerini alıp index sayfasında listeledik
exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated'); //tersten sıralama
  res.render('index', {
    photos, //photos:photos anahtar ile değer aynı olunca bu şekilde tek yazılır.
  });
};

//herbir fotograf için tekil sayfalara oluşturduk
exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

//Fotograf kaydedidildi.
exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads'; //photo yüklenecek klasör lokasyonu
  //sync li komutlar kullanmamızın sebebi bu işlemlerin senkron yapılmasını istememiz yani önce klasör oluşturulacak sonra resim kaydedilecek
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // body bilgisini Photo modeli sayesinde veritabanında dökümana dönüştürüyoruz.
  const photo = await Photo.create({
    // photo nun konumunu db ye yazma
    ...req.body,
  });
  let uploadedImage = req.files.image;
  let uploadedImageArray = uploadedImage.name.split('.');
  //aynı isimli photolarda sildikten sonra sıkıntı yaşamamak için
  let uploadedImageName =
    uploadedImageArray[0] + photo._id + '.' + uploadedImageArray[1];
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImageName;

  uploadedImage.mv(uploadPath, async () => {
    //photo yu belirlediğimiz lokasyona ekleme
    photo.image = '/uploads/' + uploadedImageName;
    await photo.save();
    res.redirect('/');
  });
};

//Fotograf bilgileri güncellendi
exports.updatePhoto = async (req, res) => {
  //db ye put request göndermede sıkıntı yok fakat browser bunu post üzerinden method override ile yapıyoruz
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

//Fotograf silme
exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  if (fs.existsSync(deletedImage)) {
    fs.unlinkSync(deletedImage);
  } //photosu olmayan kayıtları silmek için
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
