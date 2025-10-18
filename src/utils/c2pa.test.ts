import { describe, it, expect } from "vitest";
import { extractC2PAMetadata } from "./c2pa";
import type { C2PAInfo } from "@/types/c2pa.d.ts";

describe("C2PA Utilities", () => {
  describe("extractC2PAMetadata", () => {
    it("should return null when C2PA info is not present", () => {
      const c2paInfo: C2PAInfo = {
        hasC2PA: false,
      };

      const result = extractC2PAMetadata(c2paInfo);
      expect(result).toBeNull();
    });

    it("should return null when manifest store is not present", () => {
      const c2paInfo: C2PAInfo = {
        hasC2PA: true,
      };

      const result = extractC2PAMetadata(c2paInfo);
      expect(result).toBeNull();
    });

    it("should extract metadata from valid manifest store", () => {
      const c2paInfo: C2PAInfo = {
        hasC2PA: true,
        manifestStore: {
          active_manifest: "manifest1",
          manifests: {
            manifest1: {
              title: "Test Image",
              claim_generator: "Test Generator v1.0",
              signature_info: {
                issuer: "Test CA",
                time: "2024-01-01T00:00:00Z",
              },
              ingredients: [
                {
                  title: "Original Photo",
                  format: "image/jpeg",
                },
              ],
            },
          },
        },
      };

      const result = extractC2PAMetadata(c2paInfo);
      
      expect(result).not.toBeNull();
      expect(result?.title).toBe("Test Image");
      expect(result?.claimGenerator).toBe("Test Generator v1.0");
      expect(result?.signatureIssuer).toBe("Test CA");
      expect(result?.signatureTime).toBe("2024-01-01T00:00:00Z");
      expect(result?.hasIngredients).toBe(true);
      expect(result?.ingredientCount).toBe(1);
      expect(result?.validationStatus).toBe("valid");
    });

    it("should detect validation errors", () => {
      const c2paInfo: C2PAInfo = {
        hasC2PA: true,
        manifestStore: {
          active_manifest: "manifest1",
          manifests: {
            manifest1: {
              title: "Test Image",
            },
          },
          validation_status: [
            {
              code: "signature.error",
              explanation: "Invalid signature",
            },
          ],
        },
      };

      const result = extractC2PAMetadata(c2paInfo);
      
      expect(result?.validationStatus).toBe("error");
    });

    it("should detect validation warnings", () => {
      const c2paInfo: C2PAInfo = {
        hasC2PA: true,
        manifestStore: {
          active_manifest: "manifest1",
          manifests: {
            manifest1: {
              title: "Test Image",
            },
          },
          validation_status: [
            {
              code: "metadata.warning",
              explanation: "Missing metadata",
            },
          ],
        },
      };

      const result = extractC2PAMetadata(c2paInfo);
      
      expect(result?.validationStatus).toBe("warning");
    });
  });
});
