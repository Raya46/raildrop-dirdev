import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

interface RegisterData {
    full_name: string;
    email: string;
    password: string;
}

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            console.log("Attempting login with:", data);

            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                console.error("Auth error:", error);
                throw error;
            }

            if (!authData.user) {
                throw new Error("No user data returned");
            }

            const { data: userDataResult, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", authData.user.id)
                .single();

            if (userError) {
                console.error("User data error:", userError);
                throw userError;
            }

            if (authData.session) {
                await AsyncStorage.setItem("token", authData.session.access_token);
            }

            return {
                ...authData,
                userData: userDataResult as User,
            };
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);
            router.replace("/(tabs)/home");
        },
        onError: (error: any) => {
            console.error("Login error:", error);
            Alert.alert(
                "Error",
                "Gagal login. Silakan periksa email dan password Anda."
            );
        },
    });
    return mutation;
};

export const useRegister = () => {
    const mutation = useMutation({
        mutationFn: async (data: RegisterData) => {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.full_name,
                    },
                },
            });

            if (error) {
                console.error("Registration error:", error);
                throw error;
            }

            if (!authData.user) {
                throw new Error("Gagal mendaftarkan pengguna");
            }

            const { error: insertError } = await supabase.from("users").insert({
                id: authData.user.id,
                full_name: data.full_name,
                email: data.email,
            });

            if (insertError) {
                console.error("Insert user data error:", insertError);
                throw insertError;
            }

            if (authData.session) {
                await AsyncStorage.setItem("token", authData.session.access_token);
            }

            return authData;
        },
        onSuccess: () => {
            Alert.alert(
                "Registrasi Berhasil",
                "Akun Anda telah berhasil dibuat. Silakan login."
            );
            router.replace("/step1");
        },
        onError: (error) => {
            console.error("Register error:", error);
            Alert.alert("Error", `Gagal mendaftar: ${error.message}`);
        },
    });
    return {
        mutate: mutation.mutate,
        isLoading: mutation.isPending,
    };
};

export const useLogout = () =>
    useMutation({
        mutationFn: async () => {
            await supabase.auth.signOut();
            await AsyncStorage.removeItem("token");
        },
        onSuccess: () => {
            router.replace("/");
        },
        onError: async (error) => {
            console.error("Logout error:", error);
            await AsyncStorage.removeItem("token");
            router.replace("/");
        },
    });

    export const useCheckSession = () => {
    const checkSession = async (): Promise<boolean> => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                return false;
            }

            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("role");
                return false;
            }

            if (session.access_token !== token) {
                await AsyncStorage.setItem("token", session.access_token);
            }

            return true;
        } catch (error) {
            console.error("Error checking session:", error);
            return false;
        }
    };

    return { checkSession };
};

export const useGetUserById = (userId: string) => {
    return useQuery<User, Error>({
        queryKey: ["user", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
};

export const useUpdateUserBalance = () => {
    const queryClient = useQueryClient();
    const { userData, refreshUserData } = useAuth();

    return useMutation<User, Error, { userId: string; newBalance: number }>({
        mutationFn: async ({ userId, newBalance }) => {
            const { data, error } = await supabase
                .from("users")
                .update({ balance: newBalance, updated_at: new Date().toISOString() })
                .eq("id", userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            refreshUserData();
            queryClient.invalidateQueries({ queryKey: ["users", userData?.id] });
        },
    });
};

export const useUpdateUserPin = () => {
    const { refreshUserData } = useAuth();

    return useMutation<User, Error, { userId: string; pin: number }>({
        mutationFn: async ({ userId, pin }) => {
            const { data, error } = await supabase
                .from("users")
                .update({ pin })
                .eq("id", userId)
                .select()
                .single();

            if (error) {
                console.error("Error updating PIN:", error);
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            refreshUserData();
        },
    });
};