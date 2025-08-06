
import { useAuth } from "@/context/AuthContext";
import { PaymentMethod, Transaction, TransactionStatus } from "@/types/transaction";

import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CreateTransactionData {
  package_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_gateway_id?: string;
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { userData } = useAuth();

  return useMutation<Transaction, Error, CreateTransactionData>({
    mutationFn: async (data) => {
      if (!userData?.id) {
        throw new Error("User not authenticated.");
      }

      const { data: newTransaction, error } = await supabase
        .from("transactions")
        .insert({
          package_id: data.package_id,
          user_id: userData.id,
          amount: data.amount,
          payment_method: data.payment_method,
          payment_gateway_id: data.payment_gateway_id,
          status: "pending" as TransactionStatus,
        })
        .select()
        .single();

      if (error) throw error;
      return newTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};

export const useGetTransactions = () => {
  const { userData, isAuthenticated } = useAuth();

  return useQuery<Transaction[], Error>({
    queryKey: ["transactions", userData?.id],
    queryFn: async () => {
      if (!userData?.id) {
        throw new Error("User not authenticated or user ID not available.");
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && !!userData?.id,
  });
};

export const useGetTransactionById = (transactionId: string) => {
  return useQuery<Transaction, Error>({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!transactionId,
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Transaction,
    Error,
    { transactionId: string; status: TransactionStatus }
  >({
    mutationFn: async ({ transactionId, status }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", transactionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};

export const useTopUpBalance = () => {
  const queryClient = useQueryClient();
  const { userData, refreshUserData } = useAuth();

  return useMutation<null, Error, { amount: number }>({
    mutationFn: async ({ amount }) => {
      if (!userData?.id) {
        throw new Error("User not authenticated.");
      }

      if (amount <= 0) {
        throw new Error("Top-up amount must be positive.");
      }

      const { error } = await supabase.rpc("add_user_balance", {
        arg_amount: amount,
        arg_user_id: userData.id,
      });

      if (error) {
        console.error("Top-up RPC error:", error);
        throw error;
      }

      return null;
    },

    onSuccess: () => {
      refreshUserData();
      queryClient.invalidateQueries({ queryKey: ["users", userData?.id] });
    },
    onError: (error) => {
      console.error("Error during top-up:", error.message);
    },
  });
};
