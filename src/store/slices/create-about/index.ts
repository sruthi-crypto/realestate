import sliceCreator from "..";
import { CREATE_ABOUT } from "@/constants";
import { CreateAboutPayload } from "@/types/payloads";
import { CreateAboutResponse } from "@/types/responses";

const CreateAboutSlice = sliceCreator<CreateAboutPayload, CreateAboutResponse>(
    "createAboutAction",
    CREATE_ABOUT,
    "post"
);

const {
    reducer: createAboutReducer,
    asyncAction: createAboutAction,
    clearData: clearCreateAboutAction
} = CreateAboutSlice;
export { createAboutAction, clearCreateAboutAction }
export default createAboutReducer;
