const asyncHandler = require("express-async-handler");
const EventModel = require("../models/eventModel");
const addNewEvent = asyncHandler(async (req, res) => {
  const body = req.body;

  if (body) {
    const newEvent = new EventModel(body);

    newEvent.save();
    res.status(200).json({
      message: "Add new Event successfully!!!",
      data: newEvent,
    });
  } else {
    res.status(401);
    throw new Error("Event data not found");
  }
});

const toRoad = (val) => (val * Math.PI) / 180;

const calcDistance = ({ currentLat, currentLong, addressLat, addressLong }) => {
  const r = 6371;
  const dLat = toRoad(addressLat - currentLat);
  const dLon = toRoad(addressLong - currentLong);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(toRoad(currentLat)) *
      Math.cos(toRoad(addressLat));
  return r * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getEvents = asyncHandler(async (req, res) => {
  const { lat, long, distance, id } = req.query;
  const query = id ? { authorId: id } : {};
  const events = await EventModel.find(query);
  const items = [];

  if (lat && long && distance) {
    if (events.length > 0) {
      events.forEach((event) => {
        const eventDistance = calcDistance({
          currentLat: lat,
          currentLong: long,
          addressLat: event.location.lat,
          addressLong: event.location.long,
        });

        if (eventDistance < distance) {
          items.push(event);
        }
      });
    }

    res.status(200).json({
      message: "get events successfully",
      data: items,
    });
  } else {
    res.status(200).json({
      message: "get events successfully",
      data: events,
    });
  }
});

module.exports = { addNewEvent, getEvents };
