export default interface DataModel<DataType = any> {
    status : boolean;
    dataResult : DataType | undefined;
    errorMessage : string | undefined;
}