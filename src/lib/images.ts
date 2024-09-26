import crc32 from "./crc32";

// Encode image name using both name and absolute path
export const encodeImgName = (fpath: string, fname: string) => {
  return crc32(`${fpath}/${fname}`);
};
