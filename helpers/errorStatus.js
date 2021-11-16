export default function errorStatus(message, status = 404) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}
