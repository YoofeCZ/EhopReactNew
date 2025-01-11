const express = require('express');
const router = express.Router();
const slidersController = require('../controllers/slidersController');
const upload = require('../middleware/uploadMiddleware');

// Endpoint pro nahrávání obrázků
router.post('/upload', upload.single('image'), (req, res) => {
    try {
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.status(200).json({ url: imageUrl }); // Vrací URL obrázku
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  });
  

// Další endpointy pro slidery
router.get('/', slidersController.getAllSliders);
router.post('/', slidersController.createSlider);
router.put('/:id', slidersController.updateSlider);
router.delete('/:id', slidersController.deleteSlider);

module.exports = router;
