import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateInput__1 {
    id: bigint;
    penulis: string;
    tanggal: string;
    ringkasan: string;
    judul: string;
    kategori: string;
    gambarUrl: string;
    konten: string;
}
export interface UpdateInput__1 {
    id: bigint;
    penulis: string;
    tanggal: string;
    ringkasan: string;
    judul: string;
    kategori: string;
    gambarUrl: string;
    konten: string;
}
export interface T__1 {
    id: bigint;
    penulis: string;
    tanggal: string;
    ringkasan: string;
    judul: string;
    kategori: string;
    gambarUrl: string;
    konten: string;
}
export interface CreateInput__2 {
    id: bigint;
    status: Status;
    topik: Topik;
    tanggal: string;
    nama: string;
    judul: string;
    deskripsi: string;
    catatan: string;
    kontak: string;
}
export interface UpdateInput__4 {
    id: bigint;
    linkLabel: string;
    linkUrl: string;
    order: bigint;
}
export interface T__4 {
    id: bigint;
    linkLabel: string;
    linkUrl: string;
    order: bigint;
}
export interface UpdateInput__2 {
    id: bigint;
    status: Status;
    topik: Topik;
    tanggal: string;
    nama: string;
    judul: string;
    deskripsi: string;
    catatan: string;
    kontak: string;
}
export interface UpdateInput {
    id: bigint;
    aktif: boolean;
    nama: string;
    email: string;
    wilayah: string;
}
export interface T__3 {
    id: bigint;
    status: Status__1;
    sudahDivalidasi: boolean;
    jenisBantuan: string;
    koordinatLat: number;
    koordinatLng: number;
    alamat: string;
    jumlahBantuan: bigint;
    tanggal: string;
    nama: string;
    wilayah: string;
    validatorId?: string;
    keperluanBantuan: string;
    catatan: string;
}
export interface CreateInput__3 {
    id: bigint;
    status: Status__1;
    sudahDivalidasi: boolean;
    jenisBantuan: string;
    koordinatLat: number;
    koordinatLng: number;
    alamat: string;
    jumlahBantuan: bigint;
    tanggal: string;
    nama: string;
    wilayah: string;
    validatorId?: string;
    keperluanBantuan: string;
    catatan: string;
}
export interface T__2 {
    id: bigint;
    status: Status;
    topik: Topik;
    tanggal: string;
    nama: string;
    judul: string;
    deskripsi: string;
    catatan: string;
    kontak: string;
}
export interface T {
    id: bigint;
    aktif: boolean;
    nama: string;
    email: string;
    wilayah: string;
}
export interface UpdateInput__3 {
    id: bigint;
    status: Status__1;
    sudahDivalidasi: boolean;
    jenisBantuan: string;
    koordinatLat: number;
    koordinatLng: number;
    alamat: string;
    jumlahBantuan: bigint;
    tanggal: string;
    nama: string;
    wilayah: string;
    validatorId?: string;
    keperluanBantuan: string;
    catatan: string;
}
export interface CreateInput {
    id: bigint;
    aktif: boolean;
    nama: string;
    email: string;
    wilayah: string;
}
export interface CreateInput__4 {
    id: bigint;
    linkLabel: string;
    linkUrl: string;
    order: bigint;
}
export enum Status {
    diproses = "diproses",
    baru = "baru",
    selesai = "selesai"
}
export enum Status__1 {
    diproses = "diproses",
    menunggu = "menunggu",
    didistribusikan = "didistribusikan"
}
export enum Topik {
    lainnya = "lainnya",
    bantuan = "bantuan",
    pengungsian = "pengungsian",
    infrastruktur = "infrastruktur",
    bencana = "bencana",
    kesehatan = "kesehatan"
}
export interface backendInterface {
    addFooterLink(input: CreateInput__4): Promise<void>;
    addPenerimaBantuan(input: CreateInput__3): Promise<void>;
    addPengaduan(input: CreateInput__2): Promise<void>;
    addPublikasi(input: CreateInput__1): Promise<void>;
    addValidator(input: CreateInput): Promise<void>;
    deleteFooterLink(id: bigint): Promise<void>;
    deletePenerimaBantuan(id: bigint): Promise<void>;
    deletePengaduan(id: bigint): Promise<void>;
    deletePublikasi(id: bigint): Promise<void>;
    deleteValidator(id: bigint): Promise<void>;
    getAllFooterLinks(): Promise<Array<T__4>>;
    getAllPenerimaBantuan(): Promise<Array<T__3>>;
    getAllPengaduan(): Promise<Array<T__2>>;
    getAllPublikasi(): Promise<Array<T__1>>;
    getAllValidators(): Promise<Array<T>>;
    getFooterLinkById(id: bigint): Promise<T__4>;
    getPenerimaBantuanById(id: bigint): Promise<T__3>;
    getPenerimaBantuanByJenis(jenis: string): Promise<Array<T__3>>;
    getPenerimaBantuanByStatus(status: Status__1): Promise<Array<T__3>>;
    getPengaduanById(id: bigint): Promise<T__2>;
    getPublikasiById(id: bigint): Promise<T__1>;
    getValidatorById(id: bigint): Promise<T>;
    isAdmin(password: string): Promise<boolean>;
    seedSampleData(): Promise<void>;
    updateFooterLink(input: UpdateInput__4): Promise<void>;
    updatePenerimaBantuan(input: UpdateInput__3): Promise<void>;
    updatePengaduan(input: UpdateInput__2): Promise<void>;
    updatePublikasi(input: UpdateInput__1): Promise<void>;
    updateValidator(input: UpdateInput): Promise<void>;
}
