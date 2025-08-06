export type Transaction = {
    id?:string;
    package_id?:string;
    user_id:string;
    amount:number;
    status:string;
    payment_method:string;
    payment_gateway_id?:string;
    created_at?:string;
    updated_at?:string;
}