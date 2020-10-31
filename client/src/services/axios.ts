import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: `/api/v1`,
});

export const postCalibration = async (data: {
  roomId: string;
  boardImg: string;
}): Promise<any> => {
  try {
    await instance.post("/board/calibrate", data);
  } catch (err) {
    errorHandler(err);
  }
};

const errorHandler = (err: AxiosError) => {
  let errMessage: string;
  switch (err.response?.status) {
    case 400:
      errMessage = "Bad request. Kindly check your inputs.";
      break;
    case 401:
      errMessage = "Unauthorized.";
      break;
    case 403:
      errMessage = "Forbidden.";
      break;
    case 500:
      errMessage = "Internal server error.";
      break;
    default:
      errMessage = "Oops! Something went wrong.";
      break;
  }
  console.log(err);
};

export default instance;
