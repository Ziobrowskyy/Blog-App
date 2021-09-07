export interface ActionSuccessResult<DataType> {
    status : true;
    data? : DataType;
}

export interface ActionErrorResult {
    status : false;
    message : string;
}

export type ActionResult<DataType = any> = ActionSuccessResult<DataType> | ActionErrorResult;