export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "June 2-4, 2026",
    time: "09:00 AM",
  },
  {
    title: "Next.js Conf 2026",
    image: "/images/event2.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA",
    date: "October 26-27, 2026",
    time: "08:30 AM",
  },
  {
    title: "HackTheNorth 2026",
    image: "/images/event3.png",
    slug: "hack-the-north-2026",
    location: "Waterloo, Canada",
    date: "September 18-20, 2026",
    time: "10:00 AM",
  },
  {
    title: "Web3 Summit",
    image: "/images/event4.png",
    slug: "web3-summit-2026",
    location: "Berlin, Germany",
    date: "May 10-12, 2026",
    time: "09:00 AM",
  },
  {
    title: "TypeScript Conference",
    image: "/images/event5.png",
    slug: "typescript-conf-2026",
    location: "London, UK",
    date: "July 15-17, 2026",
    time: "10:00 AM",
  },
  {
    title: "AI & Machine Learning Summit",
    image: "/images/event6.png",
    slug: "ai-ml-summit-2026",
    location: "Toronto, Canada",
    date: "August 8-10, 2026",
    time: "09:30 AM",
  },
];
