import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  module PenerimaBantuan {
    public type Status = {
      #menunggu;
      #diproses;
      #didistribusikan;
    };

    public type T = {
      id : Nat;
      nama : Text;
      alamat : Text;
      wilayah : Text;
      jenisBantuan : Text;
      jumlahBantuan : Nat;
      status : Status;
      keperluanBantuan : Text;
      tanggal : Text;
      koordinatLat : Float;
      koordinatLng : Float;
      sudahDivalidasi : Bool;
      validatorId : ?Text;
      catatan : Text;
    };

    public type CreateInput = {
      id : Nat;
      nama : Text;
      alamat : Text;
      wilayah : Text;
      jenisBantuan : Text;
      jumlahBantuan : Nat;
      status : Status;
      keperluanBantuan : Text;
      tanggal : Text;
      koordinatLat : Float;
      koordinatLng : Float;
      sudahDivalidasi : Bool;
      validatorId : ?Text;
      catatan : Text;
    };

    public type UpdateInput = {
      id : Nat;
      nama : Text;
      alamat : Text;
      wilayah : Text;
      jenisBantuan : Text;
      jumlahBantuan : Nat;
      status : Status;
      keperluanBantuan : Text;
      tanggal : Text;
      koordinatLat : Float;
      koordinatLng : Float;
      sudahDivalidasi : Bool;
      validatorId : ?Text;
      catatan : Text;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Pengaduan {
    public type Status = {
      #baru;
      #diproses;
      #selesai;
    };

    public type Topik = {
      #bencana;
      #bantuan;
      #pengungsian;
      #infrastruktur;
      #kesehatan;
      #lainnya;
    };

    public type T = {
      id : Nat;
      nama : Text;
      kontak : Text;
      judul : Text;
      deskripsi : Text;
      topik : Topik;
      status : Status;
      tanggal : Text;
      catatan : Text;
    };

    public type CreateInput = {
      id : Nat;
      nama : Text;
      kontak : Text;
      judul : Text;
      deskripsi : Text;
      topik : Topik;
      status : Status;
      tanggal : Text;
      catatan : Text;
    };

    public type UpdateInput = {
      id : Nat;
      nama : Text;
      kontak : Text;
      judul : Text;
      deskripsi : Text;
      topik : Topik;
      status : Status;
      tanggal : Text;
      catatan : Text;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Publikasi {
    public type T = {
      id : Nat;
      judul : Text;
      konten : Text;
      ringkasan : Text;
      tanggal : Text;
      kategori : Text;
      gambarUrl : Text;
      penulis : Text;
    };

    public type CreateInput = {
      id : Nat;
      judul : Text;
      konten : Text;
      ringkasan : Text;
      tanggal : Text;
      kategori : Text;
      gambarUrl : Text;
      penulis : Text;
    };

    public type UpdateInput = {
      id : Nat;
      judul : Text;
      konten : Text;
      ringkasan : Text;
      tanggal : Text;
      kategori : Text;
      gambarUrl : Text;
      penulis : Text;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module FooterLink {
    public type T = {
      id : Nat;
      linkLabel : Text;
      linkUrl : Text;
      order : Nat;
    };

    public type CreateInput = {
      id : Nat;
      linkLabel : Text;
      linkUrl : Text;
      order : Nat;
    };

    public type UpdateInput = {
      id : Nat;
      linkLabel : Text;
      linkUrl : Text;
      order : Nat;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Validator {
    public type T = {
      id : Nat;
      nama : Text;
      email : Text;
      wilayah : Text;
      aktif : Bool;
    };

    public type CreateInput = {
      id : Nat;
      nama : Text;
      email : Text;
      wilayah : Text;
      aktif : Bool;
    };

    public type UpdateInput = {
      id : Nat;
      nama : Text;
      email : Text;
      wilayah : Text;
      aktif : Bool;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let penerimaBantuan = Map.empty<Nat, PenerimaBantuan.T>();
  let pengaduan = Map.empty<Nat, Pengaduan.T>();
  let publikasi = Map.empty<Nat, Publikasi.T>();
  let footerLink = Map.empty<Nat, FooterLink.T>();
  let validator = Map.empty<Nat, Validator.T>();

  public shared ({ caller }) func addPenerimaBantuan(input : PenerimaBantuan.CreateInput) : async () {
    if (penerimaBantuan.containsKey(input.id)) {
      Runtime.trap("Penerima bantuan sudah ada");
    };
    penerimaBantuan.add(input.id, input);
  };

  public shared ({ caller }) func updatePenerimaBantuan(input : PenerimaBantuan.UpdateInput) : async () {
    if (not penerimaBantuan.containsKey(input.id)) {
      Runtime.trap("Penerima bantuan tidak ditemukan");
    };
    penerimaBantuan.add(input.id, input);
  };

  public shared ({ caller }) func deletePenerimaBantuan(id : Nat) : async () {
    if (not penerimaBantuan.containsKey(id)) {
      Runtime.trap("Penerima bantuan tidak ditemukan");
    };
    penerimaBantuan.remove(id);
  };

  public query ({ caller }) func getPenerimaBantuanById(id : Nat) : async PenerimaBantuan.T {
    switch (penerimaBantuan.get(id)) {
      case (null) { Runtime.trap("Penerima bantuan tidak ditemukan") };
      case (?penerimaBantuan) { penerimaBantuan };
    };
  };

  public query ({ caller }) func getAllPenerimaBantuan() : async [PenerimaBantuan.T] {
    penerimaBantuan.values().toArray().sort();
  };

  public query ({ caller }) func getPenerimaBantuanByStatus(status : PenerimaBantuan.Status) : async [PenerimaBantuan.T] {
    let filtered = List.empty<PenerimaBantuan.T>();
    for (penerima in penerimaBantuan.values()) {
      if (penerima.status == status) {
        filtered.add(penerima);
      };
    };
    filtered.toArray().sort();
  };

  public query ({ caller }) func getPenerimaBantuanByJenis(jenis : Text) : async [PenerimaBantuan.T] {
    let filtered = List.empty<PenerimaBantuan.T>();
    for (penerima in penerimaBantuan.values()) {
      if (penerima.jenisBantuan == jenis) {
        filtered.add(penerima);
      };
    };
    filtered.toArray().sort();
  };

  public shared ({ caller }) func addPengaduan(input : Pengaduan.CreateInput) : async () {
    if (pengaduan.containsKey(input.id)) {
      Runtime.trap("Pengaduan sudah ada");
    };
    pengaduan.add(input.id, input);
  };

  public shared ({ caller }) func updatePengaduan(input : Pengaduan.UpdateInput) : async () {
    if (not pengaduan.containsKey(input.id)) {
      Runtime.trap("Pengaduan tidak ditemukan");
    };
    pengaduan.add(input.id, input);
  };

  public shared ({ caller }) func deletePengaduan(id : Nat) : async () {
    if (not pengaduan.containsKey(id)) {
      Runtime.trap("Pengaduan tidak ditemukan");
    };
    pengaduan.remove(id);
  };

  public query ({ caller }) func getPengaduanById(id : Nat) : async Pengaduan.T {
    switch (pengaduan.get(id)) {
      case (null) { Runtime.trap("Pengaduan tidak ditemukan") };
      case (?pengaduan) { pengaduan };
    };
  };

  public query ({ caller }) func getAllPengaduan() : async [Pengaduan.T] {
    pengaduan.values().toArray().sort();
  };

  public shared ({ caller }) func addPublikasi(input : Publikasi.CreateInput) : async () {
    if (publikasi.containsKey(input.id)) {
      Runtime.trap("Publikasi sudah ada");
    };
    publikasi.add(input.id, input);
  };

  public shared ({ caller }) func updatePublikasi(input : Publikasi.UpdateInput) : async () {
    if (not publikasi.containsKey(input.id)) {
      Runtime.trap("Publikasi tidak ditemukan");
    };
    publikasi.add(input.id, input);
  };

  public shared ({ caller }) func deletePublikasi(id : Nat) : async () {
    if (not publikasi.containsKey(id)) {
      Runtime.trap("Publikasi tidak ditemukan");
    };
    publikasi.remove(id);
  };

  public query ({ caller }) func getPublikasiById(id : Nat) : async Publikasi.T {
    switch (publikasi.get(id)) {
      case (null) { Runtime.trap("Publikasi tidak ditemukan") };
      case (?publikasi) { publikasi };
    };
  };

  public query ({ caller }) func getAllPublikasi() : async [Publikasi.T] {
    publikasi.values().toArray().sort();
  };

  public shared ({ caller }) func addFooterLink(input : FooterLink.CreateInput) : async () {
    if (footerLink.containsKey(input.id)) {
      Runtime.trap("Footer link sudah ada");
    };
    footerLink.add(input.id, input);
  };

  public shared ({ caller }) func updateFooterLink(input : FooterLink.UpdateInput) : async () {
    if (not footerLink.containsKey(input.id)) {
      Runtime.trap("Footer link tidak ditemukan");
    };
    footerLink.add(input.id, input);
  };

  public shared ({ caller }) func deleteFooterLink(id : Nat) : async () {
    if (not footerLink.containsKey(id)) {
      Runtime.trap("Footer link tidak ditemukan");
    };
    footerLink.remove(id);
  };

  public query ({ caller }) func getFooterLinkById(id : Nat) : async FooterLink.T {
    switch (footerLink.get(id)) {
      case (null) { Runtime.trap("Footer link tidak ditemukan") };
      case (?footerLink) { footerLink };
    };
  };

  public query ({ caller }) func getAllFooterLinks() : async [FooterLink.T] {
    footerLink.values().toArray().sort();
  };

  public shared ({ caller }) func addValidator(input : Validator.CreateInput) : async () {
    if (validator.containsKey(input.id)) {
      Runtime.trap("Validator sudah ada");
    };
    validator.add(input.id, input);
  };

  public shared ({ caller }) func updateValidator(input : Validator.UpdateInput) : async () {
    if (not validator.containsKey(input.id)) {
      Runtime.trap("Validator tidak ditemukan");
    };
    validator.add(input.id, input);
  };

  public shared ({ caller }) func deleteValidator(id : Nat) : async () {
    if (not validator.containsKey(id)) {
      Runtime.trap("Validator tidak ditemukan");
    };
    validator.remove(id);
  };

  public query ({ caller }) func getValidatorById(id : Nat) : async Validator.T {
    switch (validator.get(id)) {
      case (null) { Runtime.trap("Validator tidak ditemukan") };
      case (?validator) { validator };
    };
  };

  public query ({ caller }) func getAllValidators() : async [Validator.T] {
    validator.values().toArray().sort();
  };

  public query ({ caller }) func isAdmin(password : Text) : async Bool {
    password == "rtik2024";
  };

  public shared ({ caller }) func seedSampleData() : async () {
    let samples : [PenerimaBantuan.T] = [
      {
        id = 1;
        nama = "Budi Santoso";
        alamat = "Jl. Merpati No. 12, Surabaya";
        wilayah = "Jawa Timur";
        jenisBantuan = "makanan";
        jumlahBantuan = 100;
        status = #menunggu;
        keperluanBantuan = "Beras, Mie Instan";
        tanggal = "2023-08-15";
        koordinatLat = -7.2575;
        koordinatLng = 112.7521;
        sudahDivalidasi = false;
        validatorId = null;
        catatan = "Perlu bantuan segera";
      },
      {
        id = 2;
        nama = "Siti Aminah";
        alamat = "Jl. Anggrek No. 5, Bandung";
        wilayah = "Jawa Barat";
        jenisBantuan = "pakaian";
        jumlahBantuan = 200;
        status = #diproses;
        keperluanBantuan = "Pakaian Anak-anak";
        tanggal = "2023-08-14";
        koordinatLat = -6.9147;
        koordinatLng = 107.6098;
        sudahDivalidasi = true;
        validatorId = ?"VALID-001";
        catatan = "Sediakan ukuran untuk anak-anak";
      },
      {
        id = 3;
        nama = "Andi Wijaya";
        alamat = "Jl. Melati No. 20, Makassar";
        wilayah = "Sulawesi Selatan";
        jenisBantuan = "obat-obatan";
        jumlahBantuan = 150;
        status = #menunggu;
        keperluanBantuan = "Obat flu, paracetamol";
        tanggal = "2023-08-13";
        koordinatLat = -5.1477;
        koordinatLng = 119.4327;
        sudahDivalidasi = false;
        validatorId = null;
        catatan = "Prioritas untuk anak-anak";
      },
      {
        id = 4;
        nama = "Dewi Lestari";
        alamat = "Jl. Kenanga No. 7, Medan";
        wilayah = "Sumatera Utara";
        jenisBantuan = "selimut";
        jumlahBantuan = 120;
        status = #didistribusikan;
        keperluanBantuan = "Selimut hangat";
        tanggal = "2023-08-12";
        koordinatLat = 3.5952;
        koordinatLng = 98.6722;
        sudahDivalidasi = true;
        validatorId = ?"VALID-002";
        catatan = "Kirim via ekspedisi";
      },
      {
        id = 5;
        nama = "Eko Prasetyo";
        alamat = "Jl. Mawar No. 3, Yogyakarta";
        wilayah = "DI Yogyakarta";
        jenisBantuan = "air bersih";
        jumlahBantuan = 250;
        status = #menunggu;
        keperluanBantuan = "Air minum kemasan";
        tanggal = "2023-08-11";
        koordinatLat = -7.7971;
        koordinatLng = 110.3705;
        sudahDivalidasi = false;
        validatorId = null;
        catatan = "Butuh segera";
      },
    ];

    for (sample in samples.values()) {
      penerimaBantuan.add(sample.id, sample);
    };
  };
};
