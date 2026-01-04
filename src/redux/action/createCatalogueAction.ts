import { CreateCatalogRequest } from "@/interfaces";
import { catalogueManagementService } from "@/service";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const createCatalogue = createAsyncThunk(
    '/createCatalogue',
    async (crateCatalogue: CreateCatalogRequest) => {
        const result = await catalogueManagementService.createCatalogue(crateCatalogue);
        return result;
    }
)


export const getCatalogueTypeList = createAsyncThunk(
    '/getCatalogueTypeList',
    async () => {
        const result = await catalogueManagementService.getCatalogueTypeList();
        return result;
    },
);