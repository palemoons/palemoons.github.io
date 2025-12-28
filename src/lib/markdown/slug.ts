const createSlugger = () => {
  const seen = new Map<string, number>();
  return (raw: string) => {
    const base = slugify(raw) || "section";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
};

const slugify = (raw: string): string => {
  return (
    raw
      .toLowerCase()
      .trim()
      // replace space with "-"
      .replace(/\s+/g, "-")
      // remove separator and punctuation
      .replace(/[~`!@#$%^&*()+=[\]{}\\|;:'",.<>/?]+/g, "")
      // combine continuous "-"
      .replace(/-+/g, "-")
      // remove "-" on both sides
      .replace(/^-|-$/g, "")
  );
};

export default createSlugger;
