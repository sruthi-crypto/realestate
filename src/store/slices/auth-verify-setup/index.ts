"use client";
import { VerifySetupPayload } from "@/types/payloads";
import { VerifySetupResponse } from "@/types/responses";
import sliceCreator from "..";
import { REGISTER_VERIFY_SETUP } from "@/constants";

const verifySetupSlice = sliceCreator<VerifySetupPayload, VerifySetupResponse>(
  "verifySetupAction",
  REGISTER_VERIFY_SETUP,
  "post"
);

const {
  reducer: verifySetupReducer,
  asyncAction: verifySetupAction,
  clearData: clearVerifySetupAction,
} = verifySetupSlice;
export { verifySetupAction, clearVerifySetupAction };
export default verifySetupReducer;
