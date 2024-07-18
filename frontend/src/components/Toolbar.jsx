import React, { useState, useEffect } from "react";
import clsx from "clsx";
import moment from "moment";

function RBCToolbar(props) {
  const { label, date, view, views, onView, onNavigate } = props;
  const [month, setMonth] = useState("January");
  const mMonth = moment(date).format("MMMM");
  const months = moment.months();

  useEffect(() => {
    setMonth(mMonth);
  }, [mMonth]);

  const onChange = (event) => {
    const current = event.target.value;
    onNavigate("DATE", moment().month(current).toDate());
    setMonth(current);
  };

  const goToView = (view) => {
    onView(view);
  };

  const goToBack = () => {
    onNavigate("PREV");
  };
  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToToday = () => {
    onNavigate("TODAY");
  };


  return (
    <div className="rbc-toolbar">
      <div className="rbc-btn-group">

        <button className="" onClick={goToToday}>Today</button>
        <button onClick={goToBack}>Back</button>
        <button onClick={goToNext}>Next</button>

      </div>


      <div className="rbc-toolbar-label">
        {view === "month" ? (
          <>
            <select className="rbc-dropdown" value={month} onChange={onChange}>
              {months?.map((month) => (
                <option
                  value={month}
                  className="rbc-dropdown-option" //custom class
                  key={month}
                >
                  {month}
                </option>
              ))}
            </select>
            <span className="rbc-year"> {moment(date).format("YYYY")}</span>
          </>
        ) : (
          label
        )}
      </div>


      <div className="rbc-btn-group">
        {views?.map((item) => (
          <button
            onClick={() => goToView(item)}
            key={item}
            className={clsx({ "rbc-active": view === item })}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RBCToolbar;