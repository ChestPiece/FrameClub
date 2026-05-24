export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function fail(code: string, message: string, status = 400) {
  return Response.json(
    {
      success: false,
      error: { code, message },
    },
    { status }
  );
}

export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  return (await request.json().catch(() => null)) as T | null;
}

export function validateRequired(
  payload: Record<string, unknown>,
  fields: string[]
): boolean {
  return fields.every((f) => {
    const v = payload[f];
    return typeof v === "string" && v.trim().length > 0;
  });
}
