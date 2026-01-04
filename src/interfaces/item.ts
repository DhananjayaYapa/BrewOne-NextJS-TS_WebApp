import { PaginationRequest } from "./common";

export interface GetItemRequest extends PaginationRequest{
    type?: number
}