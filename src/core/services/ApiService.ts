import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import axios, { AxiosError } from "axios";

export default class ApiService {

  constructor(private apiEndpoint: string) {}

  protected get<T>(uri: string, responseType: 'json' | 'blob' = 'json'): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      axios.get<T>(this.getFullUrl(uri), {
        headers: this.getDefaultHeaders(),
        responseType: responseType // Set the response type here
      }).then(resp => {
        resolve(resp.data);
      }).catch((error: AxiosError) => {
        reject(this.createApiErrorForAxios(error));
      });
    });
  }

  protected post<TInput, TResult>(uri: string, input?: TInput, headers?: {[key: string]: string}): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const postHeaders = this.getDefaultHeaders();
      if (headers != null) { Object.assign(postHeaders, headers); }
      axios.post<TResult>(this.getFullUrl(uri), input, {
        headers: postHeaders,
      }).then(resp => {
        resolve(resp.data);
      }).catch((error: AxiosError) => {
        reject(this.createApiErrorForAxios(error));
      });
    });
  }

  protected put<TInput, TResult>(uri: string, input: TInput, headers?: {[key: string]: string}): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const putHeaders = this.getDefaultHeaders();
      if (headers != null) { Object.assign(putHeaders, headers); }
      axios.put<TResult>(this.getFullUrl(uri), input, {
        headers: putHeaders,
      }).then(resp => {
        resolve(resp.data);
      }).catch((error: AxiosError) => {
        reject(this.createApiErrorForAxios(error));
      });
    });
  }

  protected delete<TResult>(uri: string): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      axios.delete<TResult>(this.getFullUrl(uri), {
        headers: this.getDefaultHeaders(),
      }).then(resp => {
        resolve(resp.data);
      }).catch((error: AxiosError) => {
        reject(this.createApiErrorForAxios(error));
      });
    });
  }

  protected getDefaultHeaders(): { [key: string]: string } {
    let headers = {};
    this.appendHeaders(headers);
    return headers;
  }

  protected appendHeaders(headers: { [key: string]: string }) {
    /* Can override in descendant clients */
    headers['Cache-Control'] = 'no-cache';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  }

  protected getFullUrl(uri: string): string {
    if (!this.apiEndpoint) throw Error('apiEndpoint missing');
    if (!uri) throw Error('URI required');
    const apiUrlendsWithSlash = this.apiEndpoint[this.apiEndpoint.length - 1] === '/';
    const endpointUrlbeginsWithSlash = uri[0] === '/';
    if (!apiUrlendsWithSlash && !endpointUrlbeginsWithSlash) uri = '/' + uri;
    if (uri.includes('/https://')) {
      return uri.replace('/', '');
    } 
    return this.apiEndpoint + uri;
  }

  protected createApiErrorForAxios(error: any): ApiError {
    if (!error.isAxiosError) {
      return new ApiError("Unhandled error", 500);
    }

    if (error.response) {
      const response: any = error.response;
      const data: any = response.data;
      if (data && data.status) {
        const status = data.status.toString() as string;
        if (status.startsWith('4') && data.title) {
          return new ApiError(data.title, response.status, response.data?.code, response.data);  
        }
      }

      if (error?.detail?.fields) {
        return new FormFieldsException(error.detail.fields);
      } else if (error.message) {
        return new ApiError(error.message, response.status, response.data?.code, response.data);
      }

      return new ApiError("Unhandled Error", response.status, response.data?.code, response.data);
    }

    if (error.request) {
      return new ApiError("No response was received");
    }

    return new ApiError("Unhandled Error");
  }
}

export class ApiError {
  public status?: number;
  public message?: string;
  public error?: boolean;
  public detail?: string;

  constructor(message?: string, status?: number, code?: string, detail?: string) {
    this.message = message ?? 'Unhandled Error';
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
