import ShowpassMountedWidget, { type ShowpassMountedWidgetProps } from "./ShowpassMountedWidget";

type Props = Omit<ShowpassMountedWidgetProps, "method" | "label">;

const ShowpassMountedProductWidget = ({ className = "", ...props }: Props) => (
  <ShowpassMountedWidget {...props} method="productPurchaseWidget" label="Showpass product checkout" className={`min-h-[400px] ${className}`} />
);

export default ShowpassMountedProductWidget;
