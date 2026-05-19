import sliceCreator from "..";
import { UPDATE_PROPERTY } from "@/constants";
import { UpdatePropertyPayload } from "../../../types/payloads";
import { UpdatePropertyResponse } from "../../../types/responses";

const updatePropertySlice = sliceCreator<UpdatePropertyPayload, UpdatePropertyResponse>(
  "updatePropertyAction",
  UPDATE_PROPERTY,
  "patch"
);

const {
  reducer: updatePropertyReducer,
  asyncAction: updatePropertyAction,
  clearData: clearupdatePropertyAction
} = updatePropertySlice;
export { updatePropertyAction, clearupdatePropertyAction }
export default updatePropertyReducer;
