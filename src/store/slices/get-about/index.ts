import sliceCreator from "..";
import { GET_ABOUT } from "@/constants";
import { GetAboutResponse } from "@/types/responses";

const getAboutSlice = sliceCreator<undefined, GetAboutResponse>(
    "getAboutAction",
    GET_ABOUT,
    "get"
);

const {
    reducer: getAboutReducer,
    asyncAction: getAboutAction,
    clearData: cleargetAboutAction
} = getAboutSlice;
export { getAboutAction, cleargetAboutAction }
export default getAboutReducer;
