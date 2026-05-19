"use client";
import { GetAllUsersResponse } from "@/types/responses";
import sliceCreator from "..";
import { GETALLUSERS } from "@/constants";

const getAllUsersSlice = sliceCreator<undefined, GetAllUsersResponse>(
  "getAllUsersAction",
  GETALLUSERS,
  "get"
);

const {
  reducer: getAllUsersReducer,
  asyncAction: getAllUsersAction,
  clearData: clearGetAllUsersAction,
} = getAllUsersSlice;
export { getAllUsersAction, clearGetAllUsersAction };
export default getAllUsersReducer;
