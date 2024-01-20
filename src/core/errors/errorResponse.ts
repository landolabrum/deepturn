interface IResponse {
    status?: number;
    code?: string;
    message?:string;
    error?: boolean;
    detail?: any;
}


export default function errorResponse(response:IResponse){
    const detailHandler = (detail: any)=>{
        if(typeof detail === 'object'){
            if(detail.detail)return detail.detail;
        }else if(typeof detail === 'string')return detail;
        return 'error'
    }
    return {
        ...response,
        detail: detailHandler(response.detail)
    }
}