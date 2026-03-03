import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateInput,
  CreateInput__1,
  CreateInput__2,
  CreateInput__3,
  CreateInput__4,
  T,
  T__1,
  T__2,
  T__3,
  T__4,
  T__5,
  UpdateInput,
  UpdateInput__1,
  UpdateInput__2,
  UpdateInput__3,
  UpdateInput__4,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Penerima Bantuan ────────────────────────────────────────────────────────

export function useGetAllPenerimaBantuan() {
  const { actor, isFetching } = useActor();
  return useQuery<T__4[]>({
    queryKey: ["penerimaBantuan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPenerimaBantuan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPenerimaBantuan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInput__3) => {
      if (!actor) throw new Error("No actor");
      return actor.addPenerimaBantuan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penerimaBantuan"] });
    },
  });
}

export function useUpdatePenerimaBantuan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInput__3) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePenerimaBantuan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penerimaBantuan"] });
    },
  });
}

export function useDeletePenerimaBantuan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePenerimaBantuan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penerimaBantuan"] });
    },
  });
}

// ─── Pengaduan ───────────────────────────────────────────────────────────────

export function useGetAllPengaduan() {
  const { actor, isFetching } = useActor();
  return useQuery<T__3[]>({
    queryKey: ["pengaduan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPengaduan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPengaduan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInput__2) => {
      if (!actor) throw new Error("No actor");
      return actor.addPengaduan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengaduan"] });
    },
  });
}

export function useUpdatePengaduan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInput__2) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePengaduan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengaduan"] });
    },
  });
}

export function useDeletePengaduan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePengaduan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pengaduan"] });
    },
  });
}

// ─── Publikasi ───────────────────────────────────────────────────────────────

export function useGetAllPublikasi() {
  const { actor, isFetching } = useActor();
  return useQuery<T__2[]>({
    queryKey: ["publikasi"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublikasi();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPublikasi() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInput__1) => {
      if (!actor) throw new Error("No actor");
      return actor.addPublikasi(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publikasi"] });
    },
  });
}

export function useUpdatePublikasi() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInput__1) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePublikasi(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publikasi"] });
    },
  });
}

export function useDeletePublikasi() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePublikasi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publikasi"] });
    },
  });
}

// ─── Footer Links ────────────────────────────────────────────────────────────

export function useGetAllFooterLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<T__5[]>({
    queryKey: ["footerLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFooterLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFooterLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInput__4) => {
      if (!actor) throw new Error("No actor");
      return actor.addFooterLink(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerLinks"] });
    },
  });
}

export function useUpdateFooterLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInput__4) => {
      if (!actor) throw new Error("No actor");
      return actor.updateFooterLink(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerLinks"] });
    },
  });
}

export function useDeleteFooterLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteFooterLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerLinks"] });
    },
  });
}

// ─── Validators ──────────────────────────────────────────────────────────────

export function useGetAllValidators() {
  const { actor, isFetching } = useActor();
  return useQuery<T__1[]>({
    queryKey: ["validators"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllValidators();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddValidator() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInput) => {
      if (!actor) throw new Error("No actor");
      return actor.addValidator(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validators"] });
    },
  });
}

export function useUpdateValidator() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInput) => {
      if (!actor) throw new Error("No actor");
      return actor.updateValidator(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validators"] });
    },
  });
}

export function useDeleteValidator() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteValidator(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validators"] });
    },
  });
}

// ─── Footer Info ─────────────────────────────────────────────────────────────

export function useGetFooterInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<T | null>({
    queryKey: ["footerInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFooterInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateFooterInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (info: T) => {
      if (!actor) throw new Error("No actor");
      return actor.updateFooterInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerInfo"] });
    },
  });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("No actor");
      return actor.isAdmin(password);
    },
  });
}

export function useSeedSampleData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedSampleData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
