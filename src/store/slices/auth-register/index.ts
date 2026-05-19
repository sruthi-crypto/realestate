"use client";
import { RegisterPayload } from "@/types/payloads";
import { RegisterResponse } from "@/types/responses";
import sliceCreator from "..";
import { REGISTER } from "@/constants";

const registerSlice = sliceCreator<RegisterPayload, RegisterResponse>(
  "registerAction",
  REGISTER,
  "post"
);

const {
  reducer: registerReducer,
  asyncAction: registerAction,
  clearData: clearRegisterAction,
} = registerSlice;
export { registerAction, clearRegisterAction };
export default registerReducer;
