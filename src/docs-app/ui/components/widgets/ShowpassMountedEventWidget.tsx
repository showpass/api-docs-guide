import ShowpassMountedWidget, { type ShowpassMountedWidgetProps } from "./ShowpassMountedWidget";

type Props = Omit<ShowpassMountedWidgetProps, "method" | "label">;

const ShowpassMountedEventWidget = ({ className = "", ...props }: Props) => (
  <ShowpassMountedWidget {...props} method="eventPurchaseWidget" label="Showpass event checkout" className={`min-h-[400px] py-8 ${className}`} />
);

export default ShowpassMountedEventWidget;
