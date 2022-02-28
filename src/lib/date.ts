import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// append ZULU because ISOString is UTC time
// see: https://codeofmatt.com/javascript-date-parsing-changes-in-es6/
export const parseDate = (ISOString: string) => parseISO(ISOString + "Z");

export const formatDate = (parsedDate: Date) => format(parsedDate, "Pp", {});

export const formatDateDistance = (parsedDate: Date) =>
  formatDistanceToNow(parsedDate, {
    addSuffix: true,
    includeSeconds: true,
  });
