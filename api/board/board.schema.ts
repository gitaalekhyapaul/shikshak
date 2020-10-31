import * as yup from "yup";

export const PostRequestSchema = yup
  .object({
    roomId: yup
      .string()
      .trim()
      .matches(/[0-9A-Z]{8}/, "roomId is not valid")
      .required(),
    boardImg: yup.string().trim().min(1, "boardImg cannot br null").required(),
  })
  .required();

export type postRequest = yup.InferType<typeof PostRequestSchema>;
