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

// @route   PUT /api/agens/:eventId/complete
// @desc    Mark a event as complete
// @access  Private
router.put("/:toDoId/complete", requiresAuth, async (req, res) => {
  try {
    const toDo = await AgenDa.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }

    if (toDo.complete) {
      return res.status(400).json({ error: "ToDo is already complete" });
    }

    const updatedToDo = await AgenDa.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});
  

// @route   PUT /api/agenda/:toDoId/incomplete
// @desc    Mark a event as incomplete
// @access  Private
router.put("/:toDoId/incomplete", requiresAuth, async (req, res) => {
  try {
    const toDo = await AgenDa.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }

    if (!toDo.complete) {
      return res.status(400).json({ error: "ToDo is already incomplete" });
    }

    const updatedToDo = await AgenDa.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: false,
        completedAt: null,
      },
      {
        new: true,
      }
    );

    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   PUT /api/AGENDA/:toDoId
// @desc    Update a event
// @access  Private
router.put("/:toDoId", requiresAuth, async (req, res) => {
  try {
    const toDo = await AgenDa.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }

    const { isValid, errors } = validateToDoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedToDo = await AgenDa.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    return res.json(updatedToDo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   DELETE /api/agenda/:toDoId
// @desc    Delete a event
// @access  Private
router.delete("/:toDoId", requiresAuth, async (req, res) => {
  try {
    const toDo = await AgenDa.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "Could not find ToDo" });
    }

    await AgenDa.findOneAndRemove({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

  module.exports = router;