"use client";
import sliceCreator from "../index";
import { UPLOAD_IMAGES } from "@/constants";
import { UploadImagesResponse } from "@/types/responses";

const UploadImagesSlice = sliceCreator<FormData, UploadImagesResponse>(
  "UploadImages",
  UPLOAD_IMAGES,
  "post"
);

const {
  reducer: uploadImagesReducer,
  asyncAction: uploadImagesAction,
  clearData: clearUploadImagesAction,
} = UploadImagesSlice;
export { uploadImagesAction, clearUploadImagesAction };
export default uploadImagesReducer;
