const router = require('express').Router();

const Travel = require('../models/Travel');

// create a Travel
router.post('/', async (req,res) => {
    const newTravel = new Travel(req.body);

    try {
        const savedTravel = await newTravel.save();
        res.status(200).json(savedTravel);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

// get all Travels
router.get('/', async (req,res) => {
    try {
        const travels = await Travel.find();
        res.status(200).json(travels);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;