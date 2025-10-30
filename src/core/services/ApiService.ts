import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import axios, { AxiosError } from "axios";

export default class ApiService {
  constructor(private apiEndpoint: string) {}

  /* -------------------- HTTP helpers -------------------- */

  protected get<T>(uri: string, responseType: "json" | "blob" = "json"): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      axios
        .get<T>(this.getFullUrl(uri), {
          headers: this.getDefaultHeaders(),
          responseType,
        })
        .then((resp) => resolve(resp.data))
        .catch((error: AxiosError) => reject(this.createApiErrorForAxios(error)));
    });
  }

  protected post<TInput, TResult>(
    uri: string,
    input?: TInput,
    headers?: { [key: string]: string }
  ): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const isFormData = input instanceof FormData;

      const postHeaders = this.getDefaultHeaders();
      if (headers != null) Object.assign(postHeaders, headers);

      // Let browser set boundary for FormData
      if (isFormData) delete (postHeaders as any)["Content-Type"];

      axios
        .post<TResult>(this.getFullUrl(uri), input, { headers: postHeaders })
        .then((resp) => resolve(resp.data))
        .catch((error: AxiosError) => reject(this.createApiErrorForAxios(error)));
    });
  }

  protected put<TInput, TResult>(
    uri: string,
    input: TInput,
    headers?: { [key: string]: string }
  ): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const putHeaders = this.getDefaultHeaders();
      if (headers != null) Object.assign(putHeaders, headers);

      axios
        .put<TResult>(this.getFullUrl(uri), input, { headers: putHeaders })
        .then((resp) => resolve(resp.data))
        .catch((error: AxiosError) => reject(this.createApiErrorForAxios(error)));
    });
  }
// ApiService.ts
protected delete<TResult>(uri: string): Promise<TResult>;
protected delete<TInput, TResult>(
  uri: string,
  input: TInput,
  headers?: { [key: string]: string }
): Promise<TResult>;
protected delete<TInput, TResult>(
  uri: string,
  input?: TInput,
  headers?: { [key: string]: string }
): Promise<TResult> {
  return new Promise<TResult>((resolve, reject) => {
    const delHeaders = this.getDefaultHeaders();
    if (headers != null) Object.assign(delHeaders, headers);

    axios
      .delete<TResult>(this.getFullUrl(uri), {
        headers: delHeaders,
        // IMPORTANT: Axios sends a body for DELETE via the `data` field
        data: input ?? {}, // your FastAPI handler reads JSON here
      })
      .then((resp) => resolve(resp.data))
      .catch((error: AxiosError) => reject(this.createApiErrorForAxios(error)));
  });
}

  // protected delete<TResult>(uri: string): Promise<TResult> {
  //   return new Promise<TResult>((resolve, reject) => {
  //     axios
  //       .delete<TResult>(this.getFullUrl(uri), {
  //         headers: this.getDefaultHeaders(),
  //       })
  //       .then((resp) => resolve(resp.data))
  //       .catch((error: AxiosError) => reject(this.createApiErrorForAxios(error)));
  //   });
  // }

  // Attach Authorization header if a token exists. Accepts a token with or without "Bearer " prefix.
  protected getDefaultHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    this.appendHeaders(headers);

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    return headers;
  }

  // Look up token from localStorage/sessionStorage/cookie (non-HttpOnly)
  protected getAuthToken(): string | null {
    try {
      if (typeof localStorage !== "undefined") {
        for (const k of ["auth-token", "access_token", "token"]) {
          const v = localStorage.getItem(k);
          if (v) return v;
        }
      }
      if (typeof sessionStorage !== "undefined") {
        for (const k of ["auth-token", "access_token", "token"]) {
          const v = sessionStorage.getItem(k);
          if (v) return v;
        }
      }
      if (typeof document !== "undefined") {
        const m = document.cookie.match(/(?:^|; )auth-token=([^;]+)/);
        if (m) return decodeURIComponent(m[1]);
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  /** Default headers you can extend in subclasses. */
  // eslint-disable-next-line class-methods-use-this
  protected appendHeaders(headers: { [key: string]: string }) {
    headers["Cache-Control"] = "no-cache";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
    headers["Content-Type"] = "application/json";
  }

  /* -------------------- URL helpers -------------------- */

  protected getFullUrl(uri: string): string {
    if (!this.apiEndpoint) throw Error("apiEndpoint missing");
    if (!uri) throw Error("URI required");
    const apiUrlendsWithSlash = this.apiEndpoint[this.apiEndpoint.length - 1] === "/";
    const endpointUrlbeginsWithSlash = uri[0] === "/";
    if (!apiUrlendsWithSlash && !endpointUrlbeginsWithSlash) uri = "/" + uri;
    if (uri.includes("/https://")) return uri.replace("/", "");
    return this.apiEndpoint + uri;
  }

  /* -------------------- error shaping -------------------- */

  protected createApiErrorForAxios(error: any): ApiError {
    if (!error?.isAxiosError) return new ApiError("Unhandled error", 500);

    if (error.response) {
      const response: any = error.response;
      const data: any = response.data ?? {};
      const title = data.title || data.detail || error.message || "Unhandled Error";

      if (data?.detail?.fields)
        return new FormFieldsException(data.detail.fields, response.status, data?.code);
      return new ApiError(title, response.status, data?.code, data);
    }

    if (error.request) return new ApiError("No response was received");
    return new ApiError("Unhandled Error");
  }
}

/* -------------------- error types -------------------- */

export class ApiError {
  public status?: number;
  public message?: string;
  public error?: boolean;
  public detail?: any;

  constructor(message?: string, status?: number, code?: string, detail?: any) {
    this.message = message ?? "Unhandled Error";
    this.status = status;
    this.detail = detail;
    this.error = true;
  }
}

export class FormFieldsException extends ApiError {
  public fields?: IFormField[];

  constructor(fields?: IFormField[], status?: number, code?: string) {
    super("Form validation error", status, code);
    this.fields = fields;
    this.error = true;
  }
}
