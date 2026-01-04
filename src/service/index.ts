import axios from "axios";
import { API_BASE_URL } from "@/constant";
import { fetchAuthSession } from "aws-amplify/auth";

export const privateApiInstance = axios.create({
  baseURL: API_BASE_URL,
});

async function currentSession() {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken ?? {
      forceRefresh: true,
    };
    const token = idToken?.toString();
    return token;
  } catch (err) {
    console.log(err);
  }
}

privateApiInstance.interceptors.request.use(
  async (config) => {
    const idToken = await currentSession();

    config.headers["customer-id"] = `1`;
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export * from "./teaLotManagementService";
export * from "./catalogueManagementService";
export * from "./brokerManagementService";
export * from "./dataManagementService";
export * from "./standardDataManagementService";
export * from "./dashBoardService";
export * from "./deliveryOrderService";
export * from "./salesOrderService";
export * from "./blendItemService";
export * from "./blendService";
export * from "./sendingDeliveryOrderService";
export * from "./warehouseService";
export * from "./packingSheetService";
export * from "./attachmentsService";
export * from "./purchaseOrderManagementService";
export * from "./approvalManagementService";
export * from "./teaBoardService";
