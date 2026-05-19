import sliceCreator from "..";
import { DELETE_ABOUT } from "@/constants";
import { DeleteAboutPayload } from "@/types/payloads";
import { DeleteAboutResponse } from "@/types/responses";

const deleteAboutSlice = sliceCreator<DeleteAboutPayload, DeleteAboutResponse>(
    "deleteAboutAction",
    DELETE_ABOUT,
    "delete"
);

const {
    reducer: deleteAboutReducer,
    asyncAction: deleteAboutAction,
    clearData: clearDeleteAboutAction
} = deleteAboutSlice;
export { deleteAboutAction, clearDeleteAboutAction }
export default deleteAboutReducer;
