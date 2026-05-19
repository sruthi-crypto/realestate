"use client";
import sliceCreator from "../index";
import { CREATE_PROPERTY } from "@/constants";
import { CreatePropertyPayload } from "@/types/payloads";
import { CreatePropertyResponse } from "@/types/responses";

const createPropertySlice = sliceCreator<CreatePropertyPayload, CreatePropertyResponse>(
  "createProperty",
  CREATE_PROPERTY,
  "post"
);

const {
  reducer: createPropertyReducer,
  asyncAction: createPropertyAction,
  clearData: clearCreatePropertyAction,
} = createPropertySlice;
export { createPropertyAction, clearCreatePropertyAction };
export default createPropertyReducer;
