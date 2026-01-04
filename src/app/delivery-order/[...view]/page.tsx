import ViewDeliveryOrder from "@/components/deliveryOrder/deliveryOrderView/deliveryOrderView";
import HeaderBar from "@/components/headerBar/headerBar";

type Props = { params: { view: number } };

export default async function CatalogueViewHome({ params }: Props) {
  return (
    
      <ViewDeliveryOrder id={params.view} />
    
  );
}
