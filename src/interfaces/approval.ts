export interface CreateApprovalRequest{
      featureKey: string,
      entityId: number
}

export interface ApproveRequest{
    featureKey: string;
}

export interface RejectRequest{
    featureKey: string;
    rejectReason: string;
}