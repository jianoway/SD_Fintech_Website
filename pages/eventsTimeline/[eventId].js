import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Please from "pleasejs";

import styles from "styles/pages/Events.module.scss";

import DefaultLayout from "components/Layouts/DefaultLayout/DefaultLayout";
import EventsCalendar from "components/Calendar/EventsCalendar";
import EventCard from "components/EventCard/EventCard";
import request from "util/request";

const EventsTimeline = (props) => {
  const router = useRouter();
  const { eventId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState();
  const [selectedEvent, setSelectedEvent] = useState();

  const fetchEvents = async () => {
    try {
      const response = await request.get("events/");
      response.data.map((event) => (event.background = Please.make_color()));
      setEvents(response.data);
      setSelectedEvent(showEvent(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const showEvent = (eventList) => {
    for (let i = 0; i < eventList.length; i++) {
      if (eventList[i].id === parseInt(eventId)) {
        return eventList[i];
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchEvents().then(() => {
        setIsLoading(false);
      });
    }
  }, [router.isReady]);

  const setEvent = (event) => {
    setSelectedEvent(event);
  };

  if (isLoading) return null;

  return (
    <div>
      <DefaultLayout>
        <div className={styles.container}>
          <main className={styles.main}>
            <h1>Our Events</h1>
            <div className={styles.eventsContainer}>
              {!isLoading && (
                <EventsCalendar events={events} setEvent={setEvent} />
              )}
              <div className={styles.eventCardContainer}>
                {!isLoading && <EventCard event={selectedEvent} />}
              </div>
            </div>
          </main>
        </div>
      </DefaultLayout>
    </div>
  );
};

export default EventsTimeline;
