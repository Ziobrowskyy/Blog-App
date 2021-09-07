export default interface DataModel<DataType = any> {
    status : boolean;
    dataResult : DataType | null;
    errorMessage : string | null;
}