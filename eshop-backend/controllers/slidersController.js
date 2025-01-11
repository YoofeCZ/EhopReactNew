// src/controllers/slidersController.js
const { Slider } = require('../models');

// Získat všechny slidery
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll();
    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Vytvořit nový slider
exports.createSlider = async (req, res) => {
    const { image, caption, buttonText, buttonLink } = req.body;
  
    try {
      const newSlider = await Slider.create({ image, caption, buttonText, buttonLink });
      res.status(201).json(newSlider);
    } catch (error) {
      console.error('Error creating slider:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

// Aktualizovat slider podle ID
exports.updateSlider = async (req, res) => {
  const { id } = req.params;
  const { image, caption, buttonText, buttonLink } = req.body;
  try {
    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    slider.image = image !== undefined ? image : slider.image;
    slider.caption = caption !== undefined ? caption : slider.caption;
    slider.buttonText = buttonText !== undefined ? buttonText : slider.buttonText;
    slider.buttonLink = buttonLink !== undefined ? buttonLink : slider.buttonLink;

    await slider.save();
    res.json(slider);
  } catch (error) {
    console.error(`Error updating slider with id ${id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Smazat slider podle ID
exports.deleteSlider = async (req, res) => {
  const { id } = req.params;
  try {
    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    await slider.destroy();
    res.json({ message: 'Slider successfully deleted' });
  } catch (error) {
    console.error(`Error deleting slider with id ${id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
