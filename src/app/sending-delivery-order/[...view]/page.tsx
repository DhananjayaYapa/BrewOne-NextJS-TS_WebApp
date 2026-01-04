import HeaderBar from "@/components/headerBar/headerBar";
import ViewDeliveryOrder from "@/components/sendingDeliveryOrder/deliveryOrderView/deliveryOrderView";

type Props = { params: { view: number } };

export default async function CatalogueViewHome({ params }: Props) {
  return (
    
      <ViewDeliveryOrder id={params.view} />
    
  );
}
