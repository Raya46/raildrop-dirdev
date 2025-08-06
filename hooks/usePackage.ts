
import { useAuth } from "@/context/AuthContext";
import { LockerSize } from "@/types/lockerSize";
import { Package } from "@/types/package";
import { PackageStatus } from "@/types/packageStatus";
import { Station } from "@/types/station";
import { User } from "@/types/user";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface DetailedPackage
    extends Omit<
        Package,
        "sender" | "receiver" | "origin_station" | "destination_station"
    > {
    sender:
        | (Pick<User, "full_name" | "avatar_url"> & { full_name: string })
        | null;
    receiver:
        | (Pick<User, "full_name" | "avatar_url"> & { full_name: string })
        | null;
    origin_station: Pick<Station, "name"> | null;
    destination_station: Pick<Station, "name"> | null;
}

interface CreatePackageData {
    destination_station_id: string;
    description?: string;
    size: LockerSize;
    receiver_id: string;
    locker_id: string;
}

export const useCreatePackage = () => {
    const queryClient = useQueryClient();
    const { userData } = useAuth();

    return useMutation<Package, Error, CreatePackageData>({
        mutationFn: async (data) => {
            if (!userData?.id) {
                throw new Error("User not authenticated.");
            }

            const { data: newPackage, error } = await supabase
                .from("packages")
                .insert({
                    sender_id: userData.id,
                    receiver_id: data.receiver_id,
                    destination_station_id: data.destination_station_id,
                    description: data.description,
                    locker_id: data.locker_id,
                    size: data.size,
                    status: "awaiting_payment" as PackageStatus,
                    qr_code: data.receiver_id,
                })
                .select()
                .single();

            if (error) throw error;

            const { error: trackingError } = await supabase
                .from("tracking_history")
                .insert({
                    package_id: newPackage.id,
                    status: newPackage.status,
                    description: "Package created and awaiting payment.",
                });

            if (trackingError) throw trackingError;

            return newPackage;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["packages"] });
            queryClient.invalidateQueries({ queryKey: ["tracking_history"] });
        },
    });
};

export const useGetPackages = (status?: PackageStatus) => {
    const { userData, isAuthenticated } = useAuth();

    return useQuery<DetailedPackage[], Error>({
        queryKey: ["packages", userData?.id, status],
        queryFn: async () => {
            if (!userData?.id) {
                throw new Error("User not authenticated or user ID not available.");
            }

            const { data, error } = await supabase.rpc("get_user_packages_by_id", {
                p_user_id: userData.id,
                p_status: status,
            });

            if (error) {
                console.error("Error calling get_user_packages_by_id RPC:", error);
                throw error;
            }
            return data || [];
        },

        enabled: isAuthenticated && !!userData?.id,
    });
};

export const useGetPackageCounts = () => {
    const { userData, isAuthenticated } = useAuth();

    return useQuery<{ id: string; status: PackageStatus }[], Error>({
        queryKey: ["packageCounts", userData?.id],
        queryFn: async () => {
            if (!userData?.id) {
                throw new Error("User data is incomplete.");
            }

            const orCondition = `sender_id.eq.${userData.id},receiver_id.eq.${userData.id}`;
            const { data, error } = await supabase
                .from("packages")
                .select("id, status")
                .or(orCondition);

            if (error) throw error;
            return data || [];
        },
        enabled: isAuthenticated && !!userData?.id,
    });
};

export const getUserByEmail = async (email: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

    if (error) throw error;
    return data;
};

export const useGetPackageById = (packageId: string) => {
    return useQuery<Package, Error>({
        queryKey: ["package", packageId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("packages")
                .select("*")
                .eq("id", packageId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!packageId,
    });
};

export const useGetReceivedPackages = () => {
    const { userData, isAuthenticated } = useAuth();

    return useQuery<Package[], Error>({
        queryKey: ["receivedPackages", userData?.id],
        queryFn: async () => {
            if (!userData?.id) {
                throw new Error("User not authenticated or user ID not available.");
            }

            const { data, error } = await supabase
                .from("packages")
                .select(
                    "*, sender:users(full_name, avatar_url), receiver:users(full_name, avatar_url), origin_station:stations(name), destination_station:stations(name)"
                )
                .eq("receiver_id", userData.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: isAuthenticated && !!userData?.id,
    });
};

export const useFindReceivablePackage = ({
    packageId,
    qrCode,
}: {
    packageId?: string;
    qrCode?: string;
}) => {
    const { userData } = useAuth();

    return useQuery<DetailedPackage, Error>({
        queryKey: ["receivablePackage", packageId, qrCode],
        queryFn: async () => {
            if (!packageId || !qrCode) {
                throw new Error("Package ID and QR Code are required.");
            }
            if (!userData?.id) {
                throw new Error("User not authenticated.");
            }

            const { data, error } = await supabase.rpc("find_and_verify_package", {
                p_package_id: packageId,
                p_qr_code: qrCode,
                p_receiver_id: userData.id,
            });

            if (error) {
                console.error("Error calling find_and_verify_package RPC:", error);
                throw new Error(
                    "Package not found or you are not the designated receiver."
                );
            }

            const packageData = Array.isArray(data) ? data[0] : data;

            if (!packageData) {
                throw new Error(
                    "Package not found or you are not the designated receiver."
                );
            }

            return packageData;
        },

        enabled: !!packageId && !!qrCode && !!userData?.id,
        retry: false,
    });
};

export const useUpdatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data, error } = await supabase
                .from("packages")
                .update({ status: status, completed_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["packages"] });
            queryClient.invalidateQueries({ queryKey: ["packageCounts"] });
        },
    });
};

export const useCompletePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const { data, error } = await supabase
                .from("packages")
                .update({ status: "completed", completed_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["packages"] });
            queryClient.invalidateQueries({ queryKey: ["packageCounts"] });
        },
    });
};