export interface Feature {
    featureId: number;
    featureKey: string;
    featureName: string;
    isApprovalRequired: 1 | 0;
}

export interface UserRoleFeature {
    userRole: string;
    featureList: Feature[]
}