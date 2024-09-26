const crc32 = (str: string): string => {
  const crcTable = initCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16);
};

const initCrcTable = (): Array<number> => {
  const crcTable: Array<number> = [];
  const polynomial = 0xedb88320;

  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      if (crc & 1) crc = (crc >>> 1) ^ polynomial;
      else crc >>>= 1;
    }
    crcTable[i] = crc;
  }
  return crcTable;
};

export default crc32;
