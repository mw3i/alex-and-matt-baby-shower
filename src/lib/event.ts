import eventData from "../../data/event.json";

export type EventData = {
  title: string;
  headline: string;
  parents: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
  };
  registryUrl: string;
  images: {
    hero: string;
  };
  maps: {
    embedUrl: string;
  };
  copy: {
    supporting: string;
    rsvpPrompt: string;
    confirmation: string;
    footer: string;
  };
  google: {
    formId: string;
    entries: {
      name: string;
      attending: string;
      partySize: string;
      message: string;
    };
    sheetCsvUrl: string;
  };
};

export const event: EventData = eventData;
