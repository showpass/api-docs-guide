import ShowpassMountedWidget, { type ShowpassMountedWidgetProps } from "./ShowpassMountedWidget";

type Props = Omit<ShowpassMountedWidgetProps, "method" | "label">;

const ShowpassMountedMembershipWidget = ({ className = "", ...props }: Props) => (
  <ShowpassMountedWidget {...props} method="membershipPurchaseWidget" label="Showpass membership checkout" className={`min-h-[400px] ${className}`} />
);

export default ShowpassMountedMembershipWidget;
