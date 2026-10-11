import type {
  PortableTextBlock,
  PortableTextTextBlock,
} from "@portabletext/editor";
// Older documents can contain text without Portable Text keys. Supply only
// missing editor metadata on a copy. Do not publish or rewrite the source on load.
export function prepareBody(value: PortableTextBlock[] | undefined): {
  initialValue: PortableTextBlock[] | undefined;
  repaired: boolean;
} {
  if (!value?.length) return { initialValue: undefined, repaired: false };
  let repaired = false;
  const initialValue = structuredClone(value).map((block) => {
    if (!block._key) {
      block._key = crypto.randomUUID();
      repaired = true;
    }
    if (block._type !== "block") return block;
    const textBlock = block as PortableTextTextBlock;
    if (!textBlock.style) {
      textBlock.style = "normal";
      repaired = true;
    }
    if (!Array.isArray(textBlock.markDefs)) {
      textBlock.markDefs = [];
      repaired = true;
    }
    if (!Array.isArray(textBlock.children) || textBlock.children.length === 0) {
      textBlock.children = [
        { _type: "span", _key: crypto.randomUUID(), text: "", marks: [] },
      ];
      repaired = true;
    }
    textBlock.children = textBlock.children.map((child) => {
      if (!child._key) {
        child._key = crypto.randomUUID();
        repaired = true;
      }
      if (child._type === "span" && !Array.isArray(child.marks)) {
        child.marks = [];
        repaired = true;
      }
      return child;
    });
    return block;
  });
  return { initialValue, repaired };
}
