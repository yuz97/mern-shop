export const errorJson = (data, res) => {
  if (!data) {
    res.status(404);
    throw new Error("produk id tidak ditemukan");
  }
};
