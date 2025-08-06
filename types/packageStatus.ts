export type PackageStatus =
  | "awaiting_payment"
  | "awaiting_dropoff"
  | "in_locker_origin"
  | "in_transit"
  | "in_locker_destination"
  | "completed"
  | "cancelled";
