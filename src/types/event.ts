import { Company } from "./company";
import { UserType } from "./users";

export interface FAQ {
  question: string;
  answer: string;
}

export type EventStatus = "Upcoming" | "Past" | "Featured" | "Happening";
export type EventType =
  | "Webinar"
  | "Conference"
  | "Workshop"
  | "Networking"
  | "Launch"
  | "All";

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  org_name: string | null;
  organization: Company;
  profile_picture: string;
  created_at: string;
}

export interface SpeakerType {
  speaker: Speaker;
  note: string;
}

export interface EventInterface {
  id: string;
  title: string;
  slug: string;
  lang: string;
  location: string;
  format: EventType;
  seo_description: string;
  full_description: string;
  status: EventStatus;
  publish_status: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  faqs: FAQ[];
  organizer: Company;
  contact_person: UserType | null;
  speakers: Speaker[];
  partners: Company[];
  external_link: string;
  capacity: number;
}

export const EVENT_TYPES: EventType[] = [
  "All",
  "Webinar",
  "Conference",
  "Workshop",
  "Networking",
  "Launch",
];

export interface AgendaItem {
  id: string;
  event_id: string;
  session_title: string;
  session_description: string;
  description?: string;
  session_start: string;
  session_end: string;
  location?: string;
  speakers: string[];
}

export interface PartnerType {
  id: string;
  company: {
    id: string;
    name: string;
    logo_url: string;
    created_at: string;
    website: string;
  };
  relationship: string;
  note: string;
}

export interface CompanyEvent {
  id: string;
  event: {
    id: string;
    title: string;
    slug: string;
    start_date: string;
  };
  relationship: string;
  note: string;
}
