"use client";
import sliceCreator from "../index";
import { DELETE_PROPERTY } from "@/constants";
import { DeletePropertyPayload } from "@/types/payloads";
import { DeletePropertyResponse } from "@/types/responses";

const deletePropertySlice = sliceCreator<DeletePropertyPayload, DeletePropertyResponse>(
  "deleteProperty",
  DELETE_PROPERTY,
  "delete"
);

const {
  reducer: deletePropertyReducer,
  asyncAction: deletePropertyAction,
  clearData: clearDeletePropertyAction,
} = deletePropertySlice;
export { deletePropertyAction, clearDeletePropertyAction };
export default deletePropertyReducer;
