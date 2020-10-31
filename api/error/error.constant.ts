export const errors = {
  BAD_REQUEST: {
    httpStatus: 400,
    message: "Bad Request.",
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: 500,
    message: "Internal Server Error.",
  },
  UNAUTHORIZED: {
    httpStatus: 401,
    message: "Unauthorized.",
  },
  NOT_FOUND: {
    httpStatus: 404,
    message: "Resource Not Found.",
  },
  NOTE_NOT_FOUND: {
    httpStatus: 404,
    message: "Note Not Found.",
  },
  USER_NOT_FOUND: {
    httpStatus: 401,
    message: "Email or Password Wrong",
  },
  MONGODB_CONNECT_ERROR: {
    httpStatus: 500,
    message: "Could Not Connect to MongoDB.",
  },
  SOCKETIO_CONNECT_ERROR: {
    httpStatus: 500,
    message: "Could Not Connect to MongoDB.",
  },
  MONGODB_QUERY_ERROR: {
    httpStatus: 500,
    message: "Error Executing MongoDB Query",
  },
  JWT_ERROR: {
    httpStatus: 403,
    message: "JWT Token Not Found.",
  },
  DUPLICATE_USER: {
    httpStatus: 400,
    message: "Email ID Already Registered. Please Login.",
  },
  THERAPIST_NOT_FOUND: {
    httpStatus: 400,
    message: "Therapist Not Found with the provided Code.",
  },
  RELATION_NOT_FOUND: {
    httpStatus: 404,
    message: "Client is not Assigned to The Therapist.",
  },
};
