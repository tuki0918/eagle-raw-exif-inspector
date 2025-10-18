/**
 * C2PA (Content Authenticity and Provenance) Type Definitions
 * https://c2pa.org/
 */

export interface C2PAInfo {
  hasC2PA: boolean;
  manifestStore?: ManifestStore;
  error?: string;
}

export interface ManifestStore {
  active_manifest?: string;
  manifests?: Record<string, Manifest>;
  validation_status?: ValidationStatus[];
}

export interface Manifest {
  title?: string;
  format?: string;
  instance_id?: string;
  claim_generator?: string;
  claim_generator_info?: ClaimGeneratorInfo[];
  signature_info?: SignatureInfo;
  thumbnail?: Thumbnail;
  ingredients?: Ingredient[];
  assertions?: Record<string, unknown>;
  label?: string;
}

export interface ClaimGeneratorInfo {
  name?: string;
  version?: string;
  icon?: string;
}

export interface SignatureInfo {
  issuer?: string;
  time?: string;
  cert_serial_number?: string;
}

export interface Thumbnail {
  format?: string;
  identifier?: string;
}

export interface Ingredient {
  title?: string;
  format?: string;
  document_id?: string;
  instance_id?: string;
  relationship?: string;
  thumbnail?: Thumbnail;
  validation_status?: ValidationStatus[];
}

export interface ValidationStatus {
  code?: string;
  url?: string;
  explanation?: string;
}

export interface C2PAMetadata {
  title?: string;
  producer?: string;
  claimGenerator?: string;
  signatureIssuer?: string;
  signatureTime?: string;
  hasIngredients?: boolean;
  ingredientCount?: number;
  validationStatus?: string;
}
