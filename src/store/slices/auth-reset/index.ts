"use client";
import { ResetPayload } from "@/types/payloads";
import { SetupResponse } from "@/types/responses";
import sliceCreator from "..";
import { RESET_USER } from "@/constants";

const resetSlice = sliceCreator<ResetPayload, SetupResponse>(
  "resetAction",
  RESET_USER,
  "post"
);

const {
  reducer: resetReducer,
  asyncAction: resetAction,
  clearData: clearResetAction,
} = resetSlice;
export { resetAction, clearResetAction };
export default resetReducer;
