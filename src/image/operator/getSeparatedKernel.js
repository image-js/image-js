import { SVD } from 'ml-matrix';

export default function getSeparatedKernel(kernel) {
  const svd = new SVD(kernel, { autoTranspose: true });
  if (svd.rank !== 1) return null;
  const s = Math.sqrt(svd.s[0]);
  const v = svd.U.to2DArray().map((v) => v[0] * s);
  const h = svd.V.to2DArray().map((h) => h[0] * s);
  return [v, h];
}
