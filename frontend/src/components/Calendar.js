import React, { useState } from 'react';
import { SketchPicker } from "react-color";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Toolbar';
import RBCToolbar from './Toolbar';

const localizer = momentLocalizer(moment);

function Calen() {
  const [userData, setUserData] = useState(null);

  // Function to get data from an API with Authorization Bearer token
  const getData = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found in localStorage');
      return;
    }

    try {
      const response = await fetch('https://taskmanager-poosd-b45429dde588.herokuapp.com/api/data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await response.json();
      setUserData(userData);
      console.log('Data fetched successfully:', userData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const fullname = '${userData.firstname}' + '${userData.lastname}';
	
  const [loggedInUser, setLoggedInUser] = useState({
    name: fullname
  });

  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null); // State for start date
  const [selectedStartTime, setSelectedStartTime] = useState(null); // State for start time
  const [selectedEndDate, setSelectedEndDate] = useState(null);     // State for end date
  const [selectedEndTime, setSelectedEndTime] = useState(null);     // State for end time
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);
  const [searchOption, setSearchOption] = useState('day');

  const [searchByTitle, setSearchByTitle] = useState('');
  const [searchByDate, setSearchByDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [color, setColor] = useState('#ff0000');
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showSearchEvents, setShowSearchEvents] = useState(false);

  const handleSelectSlot = (slotInfo) => {
    setShowModal(true);
    setSelectedStartDate(slotInfo.start);  // Set start date on slot selection
    setSelectedStartTime(slotInfo.start); 
    setSelectedEndDate(slotInfo.start);    // Set end date initially to start date
    setSelectedEndTime(slotInfo.start);  
    setSelectEvent(null);
    setSelectedDay(slotInfo.start);
    setSelectedWeek(slotInfo.start);
  };

  const handleSelectedEvent = (event) => {
    setShowModal(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setSelectedStartDate(event.start);   // Set start date of selected event
    setSelectedStartTime(event.start);
    setSelectedEndDate(event.end);       // Set end date of selected event
    setSelectedEndTime(event.end); 
    setSelectedDay(event.start);
    setSelectedWeek(event.start);
  };

  const saveEvent = () => {
    if (eventTitle && selectedStartDate && selectedStartTime && selectedEndDate && selectedEndTime) {
      const startDateTime = moment(selectedStartDate).set({
        hour: moment(selectedStartTime).hour(),
        minute: moment(selectedStartTime).minute(),
      });
      const endDateTime = moment(selectedEndDate).set({
        hour: moment(selectedEndTime).hour(),
        minute: moment(selectedEndTime).minute(),
      });

      if (endDateTime.isBefore(startDateTime)) {
        alert('End time must be after start time');
        return;
      }

      if (selectEvent) {
        const updatedEvent = { ...selectEvent, title: eventTitle, start: startDateTime.toDate(), end: endDateTime.toDate() };
        const updatedEvents = events.map((event) =>
          event === selectEvent ? updatedEvent : event
        );
        setEvents(updatedEvents);
      } else {
        const newEvent = {
          title: eventTitle,
          start: startDateTime.toDate(),
          end: endDateTime.toDate(),
          backgroundColor: color,
        };
        setEvents([...events, newEvent]);
      }

      setShowModal(false);
      setEventTitle('');
      setSelectEvent(null);
      setSelectedDay(startDateTime.toDate());
      setSelectedWeek(startDateTime.toDate());
      setSelectedStartDate(null); // Reset selected start date
      setSelectedStartTime(null);
      setSelectedEndDate(null);   // Reset selected end date
      setSelectedEndTime(null);
    } else {
      alert('Please fill in all the fields');
    }
  };

  const deleteEvent = () => {
    if (selectEvent) {
      const updatedEvents = events.filter((event) => event !== selectEvent);
      setEvents(updatedEvents);
      setShowModal(false);
      setEventTitle('');
      setSelectEvent(null);
      setSelectedDay(selectEvent.start);
      setSelectedWeek(selectEvent.start);
      setSelectedStartDate(null); // Reset selected start date
      setSelectedStartTime(null);
      setSelectedEndDate(null);   // Reset selected end date
      setSelectedEndTime(null);
    }
  };

  const filteredEventsForDay = events.filter((event) =>
    moment(event.start).isSame(selectedDay, 'day')
  );

  const filteredEventsForWeek = events.filter((event) =>
    moment(event.start).isSame(selectedWeek, 'week')
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
    setSearchByTitle('');
    setSearchByDate('');
    setSearchResults([]);
  };

  const searchByTitleHandler = () => {
    if (searchByTitle.trim() !== '') {
      const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchByTitle.toLowerCase())
      );
      setSearchResults(filteredEvents);
    } else {
      setSearchResults([]);
    }
  };

  const searchByDateHandler = () => {
    if (searchByDate !== '') {
      const filteredEvents = events.filter((event) =>
        moment(event.start).isSame(searchByDate, 'day')
      );
      setSearchResults(filteredEvents);
    } else {
      setSearchResults([]);
    }
  };

  const formats = {
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dddd', culture),
  };

  const handleTodayClick = () => {
    setSelectedDay(new Date()); // Set selected day to today
    setSelectedWeek(new Date()); // Set selected week to today
  };

  const handleWeekClick = () => {
    setSelectedWeek(moment().startOf('week').toDate()); // Set selected week to current week
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
      <div style ={{height: '100vh'}}>
        {/* Header */}
        <header className = "calendarHeader" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '10px', marginBottom: '0px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ textAlign: 'center', color: 'white' }}>Welcome, {loggedInUser.name}</h2>
            <h3 style={{ textAlign: 'center', color: 'white' }}>Composition Calendar</h3>
          </div>
          <button className="btn btn-danger" onClick={() => window.location.href = "/"}>Logout</button>
        </header>

        {/* Calendar and Side Navigation */}
        <div style={{ display: 'flex' }}>

          {/* Calendar */}
          <div style={{ flex: 2, height: '600px' }}>

            {/* Grey Box with Buttons (Search and Add/Edit) */}
            <div className = "subHeaderCalendar" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)',  padding: '10px', marginBottom: '20px', width: '100%', borderBottom: '10px solid lightblue', }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>

                <button className="btn btn-success" style={{ marginRight: '10px' }} onClick={searchEvents}>Search</button>
              </div>
            </div>

            <Calendar className='mainCalendar'
              localizer={localizer}
              views={[Views.DAY, Views.WEEK, Views.MONTH]}
              startAccessor="start"
              events={events}
              formats={formats}
              endAccessor="end"
              style={{ margin: '50px' }}
              selectable={true}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectedEvent}
              components={{
                toolbar: RBCToolbar
              }}
              
            />

            {/* Grey Box with User Guide Button */}
            <div className = "subHeaderCalendar" style={{ backgroundColor:'rgba(0, 0, 0, 0.25)', padding: '10px', textAlign: 'center',  marginBottom: '20px',  borderTop: '10px solid lightblue', }}>
              <button className="btn btn-success">User Guide</button>
            </div>

          </div>

          {/* Side Navigation */}
          <div className='sideNav' style={{ flex: 1, border: '2px solid black', padding: '10px', height: '837px'}}>

            <div style={{ backgroundColor: 'white', height: '770px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: '20px' }}>
              <div>
                <h2 style={{ textAlign: 'center' }}>Current Tasks</h2>
                <hr />

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button className="btn btn-secondary mb-2" onClick={handleTodayClick}>Day</button>
                  <button className="btn btn-secondary mb-2 ms-2" onClick={handleWeekClick}>Week</button>
                </div>

                <hr />

                {selectedDay && (
                  <div>
                    <h3>Events for Current Day</h3>
                    <p>Date: {moment(selectedDay).format('MMMM Do YYYY')}</p>
                    <ul>
                      {filteredEventsForDay.map((event, index) => (
                        <li key={index}>{moment(event.start).format('LT')} - {event.title}</li>
                      ))}
                    </ul>
                    {filteredEventsForDay.length === 0 && <p>No events for this day.</p>}
                  </div>
                )}
                {selectedWeek && (
                  <div>
                    <h3>Events for Current Week</h3>
                    <p>Week: {moment(selectedWeek).startOf('week').format('MMMM Do YYYY')} - {moment(selectedWeek).endOf('week').format('MMMM Do YYYY')}</p>
                    <ul>
                      {filteredEventsForWeek.map((event, index) => (
                        <li key={index}>{moment(event.start).format('dddd, LT')} - {event.title}</li>
                      ))}
                    </ul>
                    {filteredEventsForWeek.length === 0 && <p>No events for this week.</p>}
                  </div>
                )}
                {!selectedDay && !selectedWeek && (
                  <p style={{ textAlign: 'center', margin: '10px' }}>Select a day or week on the calendar to view events.</p>
                )}

                <hr />
              </div>
            </div>
          </div>

        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="modal-dialog" style={{ maxWidth: '600px', margin: '100px auto' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectEvent ? 'Edit Event' : 'Add Event'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <label>Event Title:</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                  <label>Start Date:</label>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={selectedStartDate ? moment(selectedStartDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setSelectedStartDate(moment(e.target.value).toDate())}
                  />
		  <label>Start Time:</label>
                  <input
                    type="time"
                    className="form-control mb-3"
                    value={selectedStartTime ? moment(selectedStartTime).format('HH:mm') : ''}
                    onChange={(e) => setSelectedStartTime(moment(e.target.value, 'HH:mm').toDate())}
                  />
                  <label>End Date:</label>
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={selectedEndDate ? moment(selectedEndDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setSelectedEndDate(moment(e.target.value).toDate())}
                  />
		  <label>End Time:</label>
                  <input
                    type="time"
                    className="form-control mb-3"
                    value={selectedEndTime ? moment(selectedEndTime).format('HH:mm') : ''}
                    onChange={(e) => setSelectedEndTime(moment(e.target.value, 'HH:mm').toDate())}
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
                  <button type="button" className='btn btn-primary' onClick={saveEvent}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Guide Modal */}
        {showUserGuide && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="modal-dialog" style={{ maxWidth: '800px', margin: '100px auto' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Guide</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUserGuide(false)} />
                </div>
                <div className="modal-body">
                  {/* User Guide content */}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowUserGuide(false)}>Back</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Modal */}
        {showSearchEvents && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="modal-dialog" style={{ maxWidth: '800px', margin: '100px auto' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-center">Search Event</h5>
                  <button type="button" className="btn-close" onClick={() => setShowSearchEvents(false)} />
                </div>
                <div className="modal-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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

                    <button className="btn btn-danger" style={{ marginRight: '10px' }} onClick={clearSearch}>Clear</button>
                  </div>

                  {/* Display search results */}
                  <div>
                    {searchResults.length > 0 ? (
                      <div>
                        <h3>Search Results</h3>
                        <ul className="list-group">
                          {searchResults.map((event, index) => (
                            <li key={index} className="list-group-item">
                              <p>{moment(event.start).format('MMMM Do YYYY, LT')} - {event.title}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No results found.</p>
                    )}
                  </div>

                  {/* Back Button */}
                  <div style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" onClick={() => setShowSearchEvents(false)}>Back</button>
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
