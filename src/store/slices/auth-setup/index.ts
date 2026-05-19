"use client";
import { SetupPayload } from "@/types/payloads";
import { SetupResponse } from "@/types/responses";
import sliceCreator from "..";
import { REGISTER_SETUP } from "@/constants";

const setupSlice = sliceCreator<SetupPayload, SetupResponse>(
  "setupAction",
  REGISTER_SETUP,
  "post"
);

const {
  reducer: setupReducer,
  asyncAction: setupAction,
  clearData: clearSetupAction,
} = setupSlice;
export { setupAction, clearSetupAction };
export default setupReducer;
