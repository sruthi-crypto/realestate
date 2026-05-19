import sliceCreator from "..";
import { UPDATE_ABOUT } from "@/constants";
import { UpdateAboutPayload } from "@/types/payloads";
import { UpdateAboutResponse } from "@/types/responses";

const updateAboutSlice = sliceCreator<UpdateAboutPayload, UpdateAboutResponse>(
    "updateAboutAction",
    UPDATE_ABOUT,
    "put"
);

const {
    reducer: updateAboutReducer,
    asyncAction: updateAboutAction,
    clearData: clearUpdateAboutAction
} = updateAboutSlice;
export { updateAboutAction, clearUpdateAboutAction }
export default updateAboutReducer;
