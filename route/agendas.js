const express = require("express");
const router = express.Router();
const AgenDa = require("../module/AgenDa");
const requiresAuth = require('../middleware/permission');
const validateToDoInput = require('../validation/agendaValidation');


// @route   GET /api/todos/test
// @desc    Test the todos route
// @access  Public

router.get("/test", (req, res) => {
    res.send("agenda 's route working");
  });


  // @route   POST /api/genda/new
// @desc    Create a new agenda
// @access  Private

router.post("/new", requiresAuth, async (req, res) => {
  try {
    const { isValid, errors } = validateToDoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // create a new agenda
    const newAgenDa = new AgenDa ({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // save the new AGENDA
    await newAgenDa.save();

    return res.json(newAgenDa );
  } catch (err) {
    console.log(err);

    return res.status(500).send(err.message);
  }
});
// @route   GET /api/agenda/current
// @desc    Current users agenda
// @access  Private

router.get("/current", requiresAuth, async (req, res) => {
  try {
    const completeToDos = await AgenDa.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    const incompleteToDos = await AgenDa.find({
      user: req.user._id,
      complete: false,
    }).sort({ createdAt: -1 });

    return res.json({ incomplete: incompleteToDos, complete: completeToDos });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

  

  module.exports = router;