import { Sales } from '@/interfaces'
export interface Broker{
    brokerCode: string;
    brokerName: string;
    salesData: Sales[];
}

export interface TextFile{
    columnName: string;
    start: number;
    end: number;
}


export interface TextFileCodes{
    columnName: string;
    items: CodeValue[]
}

export interface CodeValue{
    itemCode: string, value: string
}

export interface GetBrokerParams{
    catalogTypeId?: number
}