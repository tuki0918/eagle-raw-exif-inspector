import { renderValue } from "@/utils/renderValue";

describe("renderValue", () => {
  it("returns string for null and undefined", () => {
    expect(renderValue(null)).toBe("null");
    expect(renderValue(undefined)).toBe("undefined");
  });

  it("returns string for primitive types", () => {
    expect(renderValue("abc")).toBe("abc");
    expect(renderValue(123)).toBe("123");
    expect(renderValue(true)).toBe("true");
    expect(renderValue(false)).toBe("false");
  });

  it("returns local string for Date", () => {
    const date = new Date("2020-01-01T00:00:00Z");
    expect(renderValue(date)).toBe(date.toLocaleString());
  });

  it("recursively stringifies arrays", () => {
    expect(renderValue([1, "a", false])).toBe('[1,"a",false]');
    expect(renderValue([1, [2, 3]])).toBe("[1,[2,3]]");
  });

  it("returns comma-separated string for TypedArray", () => {
    expect(renderValue(new Uint8Array([1, 2, 3]))).toBe("[object]");
    expect(renderValue(new Int16Array([4, 5]))).toBe("[object]");
  });

  it("returns JSON string for objects", () => {
    expect(renderValue({ a: 1, b: "x" })).toBe('{"a":1,"b":"x"}');
  });

  it("returns toString for circular reference objects", () => {
    type SelfRef = { self?: SelfRef };
    const obj: SelfRef = {};
    obj.self = obj;
    expect(renderValue(obj)).toBe("[object Object]");
  });
});
