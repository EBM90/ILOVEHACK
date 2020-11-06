var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");
const Event = require("../models/events");
const User = require("../models/user");
const uploadCloud = require("../config/cloudinary");

router.get("/events/add-event", withAuth, function (req, res, next) {
  res.render("events/add-event");
});

router.post(
  "/events/add-event",
  uploadCloud.single("photo"),
  withAuth,
  async (req, res, next) => {
    const { name, description, date, location } = req.body;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + dd + yyyy;
    if (date < today) {
      res.render("events/add-event", {
        errorMessage: "The event has to happen in the future :)",
      });
      return;
    } else if (name.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Your event name should have at least 5 characters",
      });
      return;
    } else if (description.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Write a longer description!",
      });
      return;
    } else if (location.length < 3) {
      res.render("events/add-event", {
        errorMessage:
          "People will need to know where to go! Tell them the place ^^",
      });
      return;
    }

    // var cuteDate = date.toLocaleDateString("es-ES");

    try {
      const event = await Event.findOne({ name: name, date: date });
      if (event !== null) {
        res.render("events/add-event", {
          errorMessage: "This event already exists!",
        });
        return;
      }

      const imgPath = req.file.url;

      await Event.create({
        name,
        date,
        location,
        description,
        imgPath,
      });
      res.redirect("all-events");
    } catch (error) {
      next(error);
    }
    User.findOneAndUpdate(
      { _id: req.session.currentUserInfo._id },
      { $push: { event: event.id } },
      { new: true }
    ).then((user) => console.log("The event was created!"));
  }
);

router.get("/events/all-events", withAuth, function (req, res, next) {
  Event.find()
    .then((allTheEventsFromDB) => {
      console.log("Retrieved events from DB:", allTheEventsFromDB);
      res.render("events/all-events", { events: allTheEventsFromDB });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/events/all-events", withAuth, async function (req, res, next) {
  try {
    const event = await Event.find();
  } catch (error) {next(error);}
});

router.get("/events/event-details/:id", withAuth, async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  Event.findOne({ _id: id }).then((event) => {
    res.render("events/event-details", { event, layout: false });
  });
});

router.get("/events/edit", withAuth, function (req, res, next) {
  Event.findOne({ _id: req.query.event_id })
    .then((event) => {
      res.render("events/edit-event", { event });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post(
  "/events/edit",
  withAuth,
  (req, res, next) => {
    const { name, description, date, location } = req.body;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + dd + yyyy;
    if (date < today) {
      res.render("events/add-event", {
        errorMessage: "The event has to happen in the future :)",
      });
      return;
    } else if (name.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Your event name should have at least 5 characters",
      });
      return;
    } else if (description.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Write a longer description!",
      });
      return;
    } else if (location.length < 3) {
      res.render("events/add-event", {
        errorMessage:
          "People will need to know where to go! Tell them the place ^^",
      });
      return;
    }

    Event.update(
      { _id: req.query.event_id },
      { $set: { name, description, date, location } }
    )
      .then((event) => {
        res.redirect("/events/all-events");
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

//edit event picture
router.get("/events/editPhoto", withAuth, function (req, res, next) {
  Event.findOne({ _id: req.query.event_id })
    .then((event) => {
      res.render("events/edit-photo", { event });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post(
  "/events/editPhoto",
  [uploadCloud.single("photo"), withAuth],
   async (req, res, next) => {
    const imgPath = req.file.url;

    await Event.updateOne(
      { _id: req.query.event_id },
      { $set: { imgPath } },
      { new: true }
    )
      .then((event) => {
        res.redirect("all-events");
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

//delete event

router.post("/events/delete", withAuth, async (req, res, next) => {
  await Event.deleteOne({ _id: req.query.event_id });
  res.redirect("all-events");
});

// FAV EVENTS

router.get("/attend-event/fav", withAuth, async (req, res, next) => {
  const userId = req.user;
  console.log(userId);
  try {
    const user = await User.findById(userId).populate('favEvent')
    console.log(user)
    console.log(userId, "this is the user id");
    res.render("user/fav-events", { user });
  } catch (error) {
    next(error);
    return;
  }
});

router.post("/attend-event/fav", withAuth, async (req, res, next) => {
  try {
    console.log("entered the route");
    const { user_id, event_id } = req.query;

      await User.findByIdAndUpdate(
        user_id,
        { $addToSet: { favEvent: event_id } },
        { new: true }
      )
      console.log("Saved in the db!");
      res.redirect("/attend-event/fav");
  } catch (error) {console.log(error)}
});

router.get

module.exports = router;
