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
    const d = date;
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const niceDate = `${da}-${mo}-${ye}`;

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

router.post("/events/editPhoto", uploadCloud.single("photo"), withAuth, async (req, res, next) => {
  const imgPath = req.file.url;

  await Event.updateOne(
    { _id: req.query.event_id },
    { $set: { imgPath } }, { new: true },
  )
    .then((event) => {
      res.redirect("/all-events");
    })
    .catch((error) => {
      console.log(error); 
    });
});

//delete event

router.post("/events/delete", withAuth, async (req, res, next) => {
  await Event.deleteOne({ _id: req.query.event_id });
    res.redirect("all-events");
});

// FAV EVENTS

// router.post("/user/fav-events", withAuth, async (req, res, next) => {
//   await Event.add({ _id: req.query.event_id });
//   const eventFav = document.querySelector("event-details")
// });

// const eventFav = document.querySelector("attend-btn");
// eventFav.addEventListener("click", () => getAdd("Event"));



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



router.get("/attend-event/:_id", (req, res, next) => {
  res.render("user/fav-events")
})

router.post("/attend-event/:_id", (req, res, next) => {
  console.log("entered the route to favourite event")
  const { name, description, date, location } = req.body

  if (name && description && date && location) {
    const attendEvent = new Event({
      name,
      description,
      date,
      location
    })
    attendEvent.save(function (err, attendEvent) {
      if (err) return console.error(err);
      console.log(attendEvent.name + " saved in the DB.");
    });

    User.findOneAndUpdate({ "_id": req.session.currentUser._id }, { $push: { attendEvents: attendEvent.id } }, { new: true })
      .then(user => console.log("Event added to user profile!"))

    res.redirect("/user/fav-events/")
  } else {
    res.render("user/fav-events", {
      errorMessage: "oh! We could not do it, try again later!"
    })
  }

})



module.exports = router;