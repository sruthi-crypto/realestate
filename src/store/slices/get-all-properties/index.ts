"use client";
import { GetAllPropertiesPayload } from "../../../types/payloads";
import { GetAllPropertiesResponse } from "../../../types/responses";
import sliceCreator from "..";
import { GETALLPROPERTIES } from "@/constants";

const getAllPropertiesSlice = sliceCreator<undefined, GetAllPropertiesResponse>(
  "getAllPropertiesAction",
  GETALLPROPERTIES,
  "get"
);

const {
  reducer: getAllPropertiesReducer,
  asyncAction: getAllPropertiesAction,
  clearData: clearGetAllPropertiesAction,
} = getAllPropertiesSlice;
export { getAllPropertiesAction, clearGetAllPropertiesAction };
export default getAllPropertiesReducer;
