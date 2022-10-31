const Photo = require('../models/Photo');

//about sayfasına yönlendirme
exports.getAboutPage = (req, res) => {
  res.render('about');
};

//add sayfasına yönlendirme
exports.getAddPage = (req, res) => {
  res.render('add');
};

//edit sayfasına yönlendirme
exports.getEditPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
};
