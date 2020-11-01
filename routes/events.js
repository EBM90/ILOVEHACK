var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");
const Event = require("../models/events");
const User = require("../models/user");
const uploadCloud = require("../config/cloudinary");

router.get("/events/add-event", withAuth, function (req, res, next) {
  res.render("events/add-event");
});

router.post("/events/add-event", uploadCloud.single("photo"), withAuth, async (req, res, next) => {
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
    User.findOneAndUpdate({ "_id": req.session.currentUserInfo._id }, { $push: { event: event.id } }, { new: true })
    .then(user => console.log("The event was created!"));
  }
);

router.get("/events/all-events", withAuth, function (req, res, next) {
  Event.find()
      .then( allTheEventsFromDB => {
        console.log('Retrieved events from DB:', allTheEventsFromDB);
        res.render('events/all-events', { events: allTheEventsFromDB });
      })
      .catch(error => {
        next(error);
      });
});

router.post("/events/all-events", withAuth, async function (req, res, next) {
  try {
    const event = await Event.find();
  } catch (error) {
    
  }
});

router.get('/events/event-details/:id', withAuth, async (req, res, next)=>{
  const { id } = req.params;
  console.log(id)
  Event.findOne({ "_id": id })
    .then(event => {
      res.render("events/event-details", { event })
    })
})

// router.get("/attend-event", withAuth, async (req, res, next) => {
//   try {
//     const { _id } = req.session.currentUser
//     const data = await Event.find()
//     const attendEvent = await User.findOne({ _id })
//     const newAttendEvent = []

//     for (attend of data) {
//       let iWillAttend = false
//       attendEvent.events.forEach(userAttend => {
//         if (attend._id.equals(userAttend._id)) {
//           iWillAttend = true
//         }
//       })
//       if (!iWillAttend) {
//         newAttendEvent.push(attend)
//       }
//     }
//     res.render("/events/attend-event", { newAttendEvent })
//   }
//   catch (error) {
//     console.log('Error finding event', error)
//   }

// })

router.get("/events/edit", withAuth, function (req, res, next) {
  Event.findOne({ _id: req.query.event_id })
    .then((event) => {
      res.render("events/edit-event", { event });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/events/edit", uploadCloud.single("photo"), withAuth, (req, res, next) => {
  const { name, description, date, location } = req.body;
  const imgPath = req.file.url;
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
    { $set: { name, description, date, location, imgPath } }
  )
    .then((event) => {
      res.redirect("/events/all-events");
    })
    .catch((error) => {
      console.log(error); 
    });
});





module.exports = router;
