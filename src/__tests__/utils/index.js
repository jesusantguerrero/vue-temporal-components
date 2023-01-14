import { addDays } from "date-fns";

export const tasks = [
  {
    id: 1,
    uid: 1,
    title: "Description",
    start: new Date(),
    end: addDays(new Date(), 2),
  },
  {
    id: 2,
    uid: 2,
    title: "Description II",
    start: new Date(),
    end: addDays(new Date(), 4),
  },
];
