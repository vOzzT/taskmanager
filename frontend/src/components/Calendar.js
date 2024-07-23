import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Toolbar";
import RBCToolbar from "./Toolbar";

const localizer = momentLocalizer(moment);

function Calen() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userId, setUserId] = useState("");
  const [data, setData] = useState([]);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchData();
  }, []);

  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null); // State for start date
  const [selectedStartTime, setSelectedStartTime] = useState(null); // State for start time
  const [selectedEndDate, setSelectedEndDate] = useState(null); // State for end date
  const [selectedEndTime, setSelectedEndTime] = useState(null); // State for end time
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setDescription] = useState("");
  const [eventId, setEventId] = useState("");
  const [selectEvent, setSelectEvent] = useState(null);
  const [searchOption, setSearchOption] = useState("day");

  const [searchByTitle, setSearchByTitle] = useState("");
  const [searchByDate, setSearchByDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [color, setColor] = useState("");
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showSearchEvents, setShowSearchEvents] = useState(false);

  const [message, setMessage] = useState("");

  function toJsonDateTime(dateTime) {
    let date = format(dateTime, "M-d-y-k-m-s");
    return date;
  }

  function convertStringToDate(str) {
    let [month, day, year, hour, minute, second] = str.split('-').map(Number);

    // Note: JavaScript months are zero-based, so we need to subtract 1 from the month.
    let date = new Date(year, month - 1, day, hour, minute, second);

    return date;
}

  const fetchData = async () => {
    try {
      const response = await fetch(buildPath("api/data"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setData(data);
      setUserId({ id: data.id });
      //let userEvents = {events: data.events};
      let i = 0;
      const obj = {};
      let ID = "";
      let EVENTTITLE = "";
      let EVENTDISC = "";
      let START = "";
      let STARTSTR = "";
      let END = "";
      let ENDSTR = "";
      let BGCOLOR = "";
      let USERID = "";
      const newEvents = [];
      for (i in data.events) {
        ID = data.events[i]._id;
        EVENTTITLE = data.events[i].Name;
        EVENTDISC = data.events[i].Description;
        STARTSTR = data.events[i].StartDate;
        ENDSTR = data.events[i].EndDate;
        console.log(typeof(STARTSTR));
        START = convertStringToDate(STARTSTR);
        END = convertStringToDate(ENDSTR);
        console.log(START, END)
        BGCOLOR = data.events[i].Color;
        USERID = data.events[i].UserId;
        const obj = {
          id: ID,
          title: EVENTTITLE,
          description: EVENTDISC,
          start: START,
          end: END,
          backgroundColor: BGCOLOR,
          userId: USERID,
        };
        console.log(obj);
        //setEvents([...events, obj]);
        newEvents.push(obj);
        console.log(data.events[i]);
        console.log(events);
      }
      setEvents(newEvents);
      console.log(data);
      console.log(data.events);
      console.log(events);
      //alert(data + " " + data.firstname + " " + data.lastname);
      if (data && data.firstname && data.lastname) {
        const fullname = `${data.firstname} ${data.lastname}`;
        console.log("Setting fullname:", fullname); // Log before setting state
        setLoggedInUser({ name: fullname });
      } else {
        console.error("User data is missing firstname or lastname");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Add Event
  const apiAddEvent = async (title, description, start, end, startDate, endDate, color) => {
    //event.preventDefault();

    //alert(title + "\n" + start + "\n" + end);
    try {
      const response = await fetch(buildPath("api/addEvent"), {
        method: "POST",
        body: JSON.stringify({
          name: title,
          description: description,
          color: color,
          tags: "",
          userId: data.id,
          endDate: end,
          startDate: start,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();

        //alert(data.id);

        const newEvent = {
          id: res.id,
          title: eventTitle,
          description: description,
          start: startDate.toDate(),
          end: endDate.toDate(),
          backgroundColor: color,
          userId: data.id,
        };
        setEvents([...events, newEvent]);
        console.log(events);
        setMessage("Event added!");
        console.log("Event added successfully");
      } else {
        setMessage(response.error || "Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setMessage(
        "Something went wrong when adding this event. Please try again later."
      );
    }
  };

  //Delete Event
  const apiDeleteEvent = async (id) => {
    try {
      const response = await fetch(buildPath("api/deleteEvent"), {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      if (response.ok) {
        setMessage("Event deleted!");
        console.log("Event deleted successfully");
      } else {
        setMessage(res.error || "Failed to add event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage(
        "Something went wrong when deleting this event. Please try again later."
      );
    }
  };

  //Get events: relies on the searchEvent Api function
  const apiGetEvents = async () => {
    //event.preventDefault();

    //alert(title + "\n" + start + "\n" + end);
    try {
      const response = await fetch(buildPath("api/searchEvent"), {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      if (response.ok) {
        setMessage("User Events retrieved!");
        console.log("All User Event retrieved successfully");
      } else {
        setMessage(res.error || "Failed to add event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage(
        "Something went wrong when deleting this event. Please try again later."
      );
    }
  };

  const app_name = "taskmanager-poosd-b45429dde588";
  function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
      return "https://" + app_name + ".herokuapp.com/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
    //return 'http://localhost:5000/' + route;
  }

  const apiUpdateEvent = async (eventId, title, description, start, end, color) => {
    try {
      const response = await fetch(buildPath("api/updateEvent"), {
        method: "POST",
        body: JSON.stringify({
          id: eventId,
          name: title,
          description: description,
          color: color,
          tags: "",
          userId: data.id,
          endDate: end,
          startDate: start,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const res = await response.json();
        return res.updatedEvent;
      } else {
        const res = await response.json();
        setMessage(res.error || "Failed to update event.");
        return null;
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("Something went wrong when updating this event. Please try again later.");
      return null;
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setShowModal(true);
    setSelectedStartDate(slotInfo.start); // Set start date on slot selection
    setSelectedStartTime(slotInfo.start);
    setSelectedEndDate(slotInfo.start); // Set end date initially to start date
    setSelectedEndTime(slotInfo.start);
    setSelectEvent(null);
    setSelectedDay(slotInfo.start);
    setSelectedWeek(slotInfo.start);
  };

  const handleSelectedEvent = (event) => {
    setShowModal(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setDescription(event.description);
    setColor(event.color);
    setSelectedStartDate(event.start); // Set start date of selected event
    setSelectedStartTime(event.start);
    setSelectedEndDate(event.end); // Set end date of selected event
    setSelectedEndTime(event.end);
    setSelectedDay(event.start);
    setSelectedWeek(event.start);
  };

  const resetEventForm = () => {
    setEventTitle("");
    setDescription("")
    setSelectEvent(null);
    setColor("#cd1c1c");
    setSelectedStartDate(null);
    setSelectedStartTime(null);
    setSelectedEndDate(null);
    setSelectedEndTime(null);
    setSelectedDay(null);
    setSelectedWeek(null);
  };

  const saveEvent = async () => {
  if (
    eventTitle &&
    selectedStartDate &&
    selectedStartTime &&
    selectedEndDate &&
    selectedEndTime
  ) {
    const startDateTime = moment(selectedStartDate).set({
      hour: moment(selectedStartTime).hour(),
      minute: moment(selectedStartTime).minute(),
    });
    const endDateTime = moment(selectedEndDate).set({
      hour: moment(selectedEndTime).hour(),
      minute: moment(selectedEndTime).minute(),
    });

    if (endDateTime.isBefore(startDateTime)) {
      alert("End time must be after start time");
      return;
    }

    if (selectEvent) {
      const updatedEvent = await apiUpdateEvent(
        selectEvent.id,
        eventTitle,
        eventDescription,
        toJsonDateTime(startDateTime.toString()),
        toJsonDateTime(endDateTime.toString()),
        color
      );

      if (updatedEvent) {
        setEvents(events.map((event) =>
          event.id === selectEvent.id ? {
            ...event,
            title: updatedEvent.Name,
            description: updatedEvent.description,
            start: convertStringToDate(updatedEvent.StartDate),
            end: convertStringToDate(updatedEvent.EndDate),
            backgroundColor: updatedEvent.Color
          } : event
        ));
      }
    } else {
      apiAddEvent(
        eventTitle,
        eventDescription,
        toJsonDateTime(startDateTime.toString()),
        toJsonDateTime(endDateTime.toString()),
        startDateTime,
        endDateTime,
        color
      );
    }

    setShowModal(false);
    resetEventForm();
  } else {
    alert("Please fill in all the fields");
  }
};

  const deleteEvent = () => {
    if (selectEvent) {
      apiDeleteEvent(selectEvent.id);
      //alert(selectEvent.id);
      const updatedEvents = events.filter((event) => event !== selectEvent);
      setEvents(updatedEvents);
      setShowModal(false);
      setEventTitle("");
      setEventId("");
      setSelectEvent(null);
      setSelectedDay(selectEvent.start);
      setSelectedWeek(selectEvent.start);
      setSelectedStartDate(null); // Reset selected start date
      setSelectedStartTime(null);
      setSelectedEndDate(null); // Reset selected end date
      setSelectedEndTime(null);
    }
  };

  const filteredEventsForDay = events.filter((event) =>
    moment(event.start).isSame(selectedDay, "day")
  );

  const filteredEventsForWeek = events.filter((event) =>
    moment(event.start).isSame(selectedWeek, "week")
  );

  const filteredEventsforTitle = events.filter((event) =>
    event.title.toLowerCase().includes(searchByTitle.toLowerCase())
  );

  const handleSearchOptionChange = (option) => {
    setSearchOption(option);
  };

  const openUserGuide = () => {
    setShowUserGuide(true);
  };

  const searchEvents = () => {
    setShowSearchEvents(true);
  };

  const clearSearch = () => {
    setSearchByTitle("");
    setSearchByDate("");
    setSearchResults([]);
  };

  const searchByTitleHandler = () => {
    if (searchByTitle.trim() !== "") {
      const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchByTitle.toLowerCase())
      );
      setSearchResults(filteredEvents);
    } else {
      setSearchResults([]);
    }
  };

  const searchByDateHandler = () => {
    if (searchByDate !== "") {
      const filteredEvents = events.filter((event) =>
        moment(event.start).isSame(searchByDate, "day")
      );
      setSearchResults(filteredEvents);
    } else {
      setSearchResults([]);
    }
  };

  const formats = {
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, "dddd", culture),
  };

  const handleTodayClick = () => {
    setSelectedDay(new Date()); // Set selected day to today
    setSelectedWeek(new Date()); // Set selected week to today
  };

  const handleWeekClick = () => {
    setSelectedWeek(moment().startOf("week").toDate()); // Set selected week to current week
  };

  const eventPropGetter = (event, start, end, isSelected) => {
    let newStyle = {
      backgroundColor: event.backgroundColor,
      color: 'white',
      borderRadius: '0px',
      border: 'none'
    };
  
    return {
      className: "",
      style: newStyle
    };
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossorigin="anonymous"
      ></link>
      <div style={{ height: "100vh" }}>
        {/* Header */}
        <header
          className="calendarHeader"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            padding: "10px",
            marginBottom: "0px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ textAlign: "center", color: "Black" }}>
              Welcome, {loggedInUser.name}
            </h2>
            <h3 style={{ textAlign: "center", color: "Black" }}>
              Composition Calendar
            </h3>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => (window.location.href = "/")}
          >
            Logout
          </button>
        </header>

        {/* Calendar and Side Navigation */}
        <div style={{ display: "flex" }}>
          {/* Calendar */}
          <div style={{ flex: 2, height: "600px" }}>
            {/* Grey Box with Buttons (Search and Add/Edit) */}
            <div
              className="subHeaderCalendar"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                padding: "10px",
                marginBottom: "20px",
                width: "100%",
                borderBottom: "10px solid lightblue",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="btn btn-success"
                  style={{ marginRight: "10px" }}
                  onClick={searchEvents}
                >
                  Search
                </button>
              </div>
            </div>

            <Calendar
              className="mainCalendar"
              localizer={localizer}
              views={[Views.DAY, Views.WEEK, Views.MONTH]}
              startAccessor="start"
              events={events}
              formats={formats}
              endAccessor="end"
              style={{ margin: "50px" }}
              selectable={true}
              eventPropGetter={eventPropGetter}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectedEvent}
              components={{
                toolbar: RBCToolbar,
              }}
            />

          </div>

          {/* Side Navigation */}
          <div
            className="sideNav"
            style={{
              flex: 1,
              border: "2px solid black",
              padding: "10px",
              height: "837px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                height: "770px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: "20px",
              }}
            >
              <div>
                <h2 style={{ textAlign: "center" }}>Current Tasks</h2>
                <hr />

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    className="btn btn-secondary mb-2"
                    onClick={handleTodayClick}
                  >
                    Day
                  </button>
                  <button
                    className="btn btn-secondary mb-2 ms-2"
                    onClick={handleWeekClick}
                  >
                    Week
                  </button>
                </div>

                <hr />

                {selectedDay && (
                  <div>
                    <h3>Events for Current Day</h3>
                    <p>Date: {moment(selectedDay).format("MMMM Do YYYY")}</p>
                    <ul>
                      {filteredEventsForDay.map((event, index) => (
                        <li key={index}>
                          {moment(event.start).format("LT")} - {event.title}
                        </li>
                      ))}
                    </ul>
                    {filteredEventsForDay.length === 0 && (
                      <p>No events for this day.</p>
                    )}
                  </div>
                )}
                {selectedWeek && (
                  <div>
                    <h3>Events for Current Week</h3>
                    <p>
                      Week:{" "}
                      {moment(selectedWeek)
                        .startOf("week")
                        .format("MMMM Do YYYY")}{" "}
                      -{" "}
                      {moment(selectedWeek)
                        .endOf("week")
                        .format("MMMM Do YYYY")}
                    </p>
                    <ul>
                      {filteredEventsForWeek.map((event, index) => (
                        <li key={index}>
                          {moment(event.start).format("dddd, LT")} -{" "}
                          {event.title}
                        </li>
                      ))}
                    </ul>
                    {filteredEventsForWeek.length === 0 && (
                      <p>No events for this week.</p>
                    )}
                  </div>
                )}
                {!selectedDay && !selectedWeek && (
                  <p style={{ textAlign: "center", margin: "10px" }}>
                    Select a day or week on the calendar to view events.
                  </p>
                )}

                <hr />
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div
              className="modal-dialog"
              style={{ maxWidth: "600px", margin: "100px auto" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectEvent ? "Edit Event" : "Add Event"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <label>Event Title:</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                  <label>Event Description:</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={eventDescription}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label>Start Date:</label>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={
                      selectedStartDate
                        ? moment(selectedStartDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedStartDate(moment(e.target.value).toDate())
                    }
                  />
                  <label>Start Time:</label>
                  <input
                    type="time"
                    className="form-control mb-3"
                    value={
                      selectedStartTime
                        ? moment(selectedStartTime).format("HH:mm")
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedStartTime(
                        moment(e.target.value, "HH:mm").toDate()
                      )
                    }
                  />
                  <label>End Date:</label>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={
                      selectedEndDate
                        ? moment(selectedEndDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedEndDate(moment(e.target.value).toDate())
                    }
                  />
                  <label>End Time:</label>
                  <input
                    type="time"
                    className="form-control mb-3"
                    value={
                      selectedEndTime
                        ? moment(selectedEndTime).format("HH:mm")
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedEndTime(
                        moment(e.target.value, "HH:mm").toDate()
                      )
                    }
                  />
                  <SketchPicker
                  color={color}
                  onChangeComplete={(color) => setColor(color.hex)}
                />
                </div>
                <div className="modal-footer">
                  {selectEvent && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={deleteEvent}
                    >
                      Delete Event
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveEvent}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Modal */}
        {showSearchEvents && (
          <div
            className="modal"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div
              className="modal-dialog"
              style={{ maxWidth: "800px", margin: "100px auto" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-center">Search Event</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSearchEvents(false)}
                  />
                </div>
                <div className="modal-body">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="input-group">
                      <input
                        type="search"
                        className="form-control rounded"
                        placeholder="Search by Title"
                        value={searchByTitle}
                        onChange={(e) => setSearchByTitle(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={searchByTitleHandler}
                      >
                        Search
                      </button>
                    </div>
                    <div className="input-group">
                      <input
                        type="date"
                        className="form-control rounded"
                        value={searchByDate}
                        onChange={(e) => setSearchByDate(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={searchByDateHandler}
                      >
                        Search
                      </button>
                    </div>

                    <button
                      className="btn btn-danger"
                      style={{ marginRight: "10px" }}
                      onClick={clearSearch}
                    >
                      Clear
                    </button>
                  </div>

                  {/* Display search results */}
                  <div>
                    {searchResults.length > 0 ? (
                      <div>
                        <h3>Search Results</h3>
                        <ul className="list-group">
                          {searchResults.map((event, index) => (
                            <li key={index} className="list-group-item">
                              <p>
                                {moment(event.start).format("MMMM Do YYYY, LT")}{" "}
                                - {event.title}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No results found.</p>
                    )}
                  </div>

                  {/* Back Button */}
                  <div style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowSearchEvents(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Calen;
