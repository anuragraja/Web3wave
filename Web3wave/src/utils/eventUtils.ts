import { BackendEvent } from "@/src/api/events/types";
import { LumaEvent } from "@/components/LumaEventGrid";

export function categoryToBackend(frontendCategory: string): string {
  const norm = frontendCategory.trim().toUpperCase();
  if (norm === "WORKSHOPS" || norm === "WORKSHOP") return "WORKSHOP";
  if (norm === "HACKATHONS" || norm === "HACKATHON") return "HACKATHON";
  if (norm === "MEETUPS" || norm === "MEETUP") return "MEETUP";
  if (norm === "GRANT SPRINTS" || norm === "GRANT SPRINT" || norm === "GRANT_SPRINT") return "GRANT_SPRINT";
  return "WORKSHOP";
}

export function categoryToFrontend(backendCategory: string): string {
  const norm = (backendCategory || "").toUpperCase();
  if (norm === "WORKSHOP") return "Workshops";
  if (norm === "HACKATHON") return "Hackathons";
  if (norm === "MEETUP") return "Meetups";
  if (norm === "GRANT_SPRINT") return "Grant Sprints";
  return "Workshops";
}

export function mapBackendEventToLumaEvent(evt: BackendEvent): LumaEvent {
  const dateObj = new Date(evt.date);
  const isValidDate = !isNaN(dateObj.getTime());

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const fullMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayName = isValidDate ? (days[dateObj.getDay()] || "") : "";
  const monthName = isValidDate ? (months[dateObj.getMonth()] || "SEP") : "SEP";
  const fullMonthName = isValidDate ? (fullMonths[dateObj.getMonth()] || "September") : "September";
  const dayNum = isValidDate ? String(dateObj.getDate()).padStart(2, "0") : "27";
  const year = isValidDate ? dateObj.getFullYear() : 2026;

  const dateString = `${dayNum} ${fullMonthName} ${year}`;
  const catDisplay = categoryToFrontend(evt.category);

  return {
    id: evt._id,
    title: evt.title,
    eventType: catDisplay === "Workshops" ? "1 Day Workshop" : catDisplay,
    dateString,
    dayNumber: dayNum,
    monthName,
    timeString: evt.startTime + (evt.endTime ? ` - ${evt.endTime}` : ""),
    venue: evt.location,
    location: evt.location,
    hostName: evt.organizerName || "Web3Wave Host",
    hostAvatar: "/web3wave-logo.png",
    coverImage: evt.poster || "",
    category: catDisplay,
    attendeeCount: 0,
    capacity: evt.capacity || 100,
    price: "Free",
    description: evt.description,
    agenda: [
      `${evt.startTime} — ${evt.title} Welcome & Keynote`,
      "Hands-on Developer Sessions & Demos",
      "Networking & Community Swag Distribution",
    ],
    highlights: [
      "Upto ₹10K Free Goodies (Stickers, Swags & More)",
      "Free Refreshments (Snacks & Beverages for all attendees)",
      "Meet & Network with like-minded builders",
      "Learn from Industry Experts",
    ],
  };
}

export function isUserAdmin(user: any): boolean {
  if (!user) return false;
  if (typeof user.role === "object" && user.role !== null) {
    return user.role.name?.toLowerCase() === "admin";
  }
  if (typeof user.role === "string") {
    return user.role.toLowerCase() === "admin";
  }
  return false;
}
