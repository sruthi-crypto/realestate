import sliceCreator from "..";
import { GET_PROPERTY_BY_ID } from "@/constants";
import { GetPropertyByIdPayload } from "@/types/payloads";
import { GetPropertyByIdResponse } from "@/types/responses";

const GetPropertyByIdSlice = sliceCreator<GetPropertyByIdPayload, GetPropertyByIdResponse>(
  "GetPropertyBYId",
  GET_PROPERTY_BY_ID,
  "get"
);

const {
  reducer: getPropertyByIdReducer,
  asyncAction: getPropertyByIdAction,
  clearData: cleargetPropertyByIdAction
} = GetPropertyByIdSlice;
export { getPropertyByIdAction, cleargetPropertyByIdAction }
export default getPropertyByIdReducer;
