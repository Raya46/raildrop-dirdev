export type Package = {
    id?:string;
    sender_id:string;
    destination_station_id:string;
    locker_id:string;
    description:string;
    size:string;
    status:string;
    qr_code:string;
    created_at?:string;
    completed_at?:string;
    receiver_id:string;
}