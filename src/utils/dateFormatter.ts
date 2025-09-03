import { format as formatDate } from "date-fns";

export const dateFormatter = (date: Date, pattern: string = "dd-MM-yyyy") => {
  return formatDate(date, pattern);
};
