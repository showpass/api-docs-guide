import ShowpassMountedWidget, { type ShowpassMountedWidgetProps } from "./ShowpassMountedWidget";

interface Props extends Omit<ShowpassMountedWidgetProps, "method" | "label" | "id"> {
  venueId?: string;
}

const ShowpassMountedCalendarWidget = ({ venueId = "1964", className = "", ...props }: Props) => (
  <ShowpassMountedWidget {...props} id={venueId} method="calendarWidget" label="Showpass event calendar" className={`min-h-[500px] ${className}`} />
);

export default ShowpassMountedCalendarWidget;
