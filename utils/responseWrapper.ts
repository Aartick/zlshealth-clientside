export function success(statusCode: number, result: any) {
  return {
    status: "ok",
    statusCode,
    result,
  };
}

export function error(statusCode: number, result: any) {
  return {
    status: "error",
    statusCode,
    result,
  };
}
