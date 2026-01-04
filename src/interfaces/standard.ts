import { APIGetResponse, PaginationRequest } from "@/interfaces";
export interface StandardData{
    standardId: number | undefined;
    standardName: string | undefined
    standardDescription?: string;
}
export interface GetStandardDataDetailsResponse extends APIGetResponse<StandardData>{
}