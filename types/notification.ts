export type Notification = {
    id?:string;
    user_id:string;
    package_id:string;
    title:string;
    message:string;
    is_read:boolean;
    created_at?:string
}