import { getEventDetail, getSimilarEventBySlug } from "@/lib/actions/event.action";
import { IEvent } from "@/models/Event";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center ">
    <img src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgendaItem = ({ agendaItem }: { agendaItem: string[] }) => (
  <div className="agenda ">
    <h2>Agenda</h2>
    <ol>
      {agendaItem.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  </div>
);


const EventTags = ({tags}:{tags:string[]})=>(
  <div className="flex flex-row-gap-2 flex-wrap">
    {tags.map((tag)=>(
      <p key={tag} className="pill">{tag}</p>
    ))}

  </div>
)


const EventDetails = async ({
  params,
}: {
  params: Promise< string >;
}) => {

  'use cache';
  cacheLife('minutes');

  const  slug  = await params;

  console.log("slug: ", slug);
  

  const  event:IEvent[]  = await getEventDetail(slug);

const {
  description,
  _id,
  image,
  overview,
  date,
  time,
  location,
  mode,
  agenda,
  audience,
  tags,
  organizer
} = event[0];
  


  // const response = await fetch(`${BASE_URL}/api/events/${slug}`,{
  //   next:{
  //     revalidate:60
  //   }
  // });

  // if (!response.ok) {
  //   const errorData = await response.json();
  //   console.error("API Error:", errorData);
  //   return notFound();
  // }

  // const {
  //   event: {
  //     description,
  //     _id,
  //     image,
  //     overview,
  //     date,
  //     time,
  //     location,
  //     mode,
  //     agenda,
  //     audience,
  //     tags,
  //     organizer
  //   },
  // } = await response.json();


  if (!description) {
    return notFound();
  }

  const booking = 10;

  const similarEvent:IEvent[] = await getSimilarEventBySlug(slug);

  return (
    <>
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left side */}
        <div className="content">
          <img
            src={image}
            alt="Event Image"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <div className="gap-4">
              <EventDetailItem
                icon="/icons/calendar.svg"
                alt="Calendar Icon"
                label={date}
              />
              <EventDetailItem
                icon="/icons/clock.svg"
                alt="Time Icon"
                label={time}
              />
              <EventDetailItem
                icon="/icons/pin.svg"
                alt="Location Icon"
                label={location}
              />
              <EventDetailItem
                icon="/icons/mode.svg"
                alt="Mode Icon"
                label={mode}
              />
              <EventDetailItem
                icon="/icons/audience.svg"
                alt="Audience Icon"
                label={audience}
              />
            </div>
          </section>

          <EventAgendaItem agendaItem={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />

        </div>

        {/* right side */}

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            { booking > 0 ? (
              <p className="text-sm">Join {booking} people who have already booked their spot!</p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={_id.toString()} slug={slug} />
          </div>

        </aside>
      </div>

            <div className="flex w-full flex-col gap-4 pt-20">
              <h2>Similar Events</h2>
              <div className="events">
                {
                  similarEvent.length > 0 && similarEvent.map((similarEvent:IEvent)=>(
                    <EventCard key={similarEvent.title} {...similarEvent}/>
                  ))
                }
              </div>
            </div>

    </section>
    </>
  );
};

export default EventDetails;
