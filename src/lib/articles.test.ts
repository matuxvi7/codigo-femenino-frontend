import { describe, expect, it } from "vitest";
import { articleImage, articleImageSrcSet, formatDate } from "./articles";

describe("article images", () => {
  const article = {
    imageUrl: "https://res.cloudinary.com/gvamujrm/image/upload/v1791676280/articles/hero.jpg",
    category: "autoestima",
  };

  it("requests an optimized Cloudinary image", () => {
    expect(articleImage(article)).toBe(
      "https://res.cloudinary.com/gvamujrm/image/upload/f_auto,q_auto,w_1200,c_limit/v1791676280/articles/hero.jpg",
    );
  });

  it("builds responsive image candidates for Cloudinary images", () => {
    expect(articleImageSrcSet(article, [480, 768])).toBe(
      "https://res.cloudinary.com/gvamujrm/image/upload/f_auto,q_auto,w_480,c_limit/v1791676280/articles/hero.jpg 480w, https://res.cloudinary.com/gvamujrm/image/upload/f_auto,q_auto,w_768,c_limit/v1791676280/articles/hero.jpg 768w",
    );
  });

  it("uses the category fallback for images without a URL", () => {
    expect(articleImage({ imageUrl: null, category: "autoestima" })).toContain("cat-autoestima");
    expect(articleImageSrcSet({ imageUrl: null, category: "autoestima" }, [480])).toBeUndefined();
  });
});

describe("formatDate", () => {
  it("formats timestamps consistently in UTC", () => {
    expect(formatDate("2026-10-10T00:30:00.000Z")).toBe("10 de octubre de 2026");
  });
});
