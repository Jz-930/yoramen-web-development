type Environment = Readonly<Record<string, string | undefined>>;

export type PublicationRotation = {
  generation: string;
  primarySecret?: string;
  webhookLegacySecret?: string;
  commitLegacySecret?: string;
};

export class PublicationConfigurationError extends Error {
  constructor() {
    super("Publication rotation is not configured");
    this.name = "PublicationConfigurationError";
  }
}

function enabled(value: string | undefined): boolean {
  if (value === undefined || value === "false") return false;
  if (value === "true") return true;
  throw new PublicationConfigurationError();
}

function present(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function resolvePublicationRotation(env: Environment): PublicationRotation {
  const generation = env.PUBLICATION_GENERATION ?? "legacy";
  if (!/^[a-z0-9][a-z0-9_-]{0,47}$/.test(generation)) throw new PublicationConfigurationError();
  const acceptWebhookLegacy = enabled(env.SANITY_ACCEPT_LEGACY_WEBHOOK_SIGNATURES);
  const acceptCommitLegacy = enabled(env.PUBLICATION_ACCEPT_LEGACY_COMMIT_SIGNATURES);
  const legacy = env.SANITY_REVALIDATE_SECRET;
  if (generation === "legacy") {
    // Preserve the pre-rotation token and signer when no rotation is configured.
    if (env.SANITY_REVALIDATE_SECRET_V2 !== undefined || acceptWebhookLegacy || acceptCommitLegacy) {
      throw new PublicationConfigurationError();
    }
    return { generation, primarySecret: present(legacy) ? legacy : undefined };
  }
  const next = env.SANITY_REVALIDATE_SECRET_V2;
  if (!present(next)) throw new PublicationConfigurationError();
  if (present(legacy) && next === legacy) throw new PublicationConfigurationError();
  if ((acceptWebhookLegacy || acceptCommitLegacy) && !present(legacy)) throw new PublicationConfigurationError();
  return {
    generation,
    primarySecret: next,
    webhookLegacySecret: acceptWebhookLegacy ? legacy : undefined,
    commitLegacySecret: acceptCommitLegacy ? legacy : undefined,
  };
}

export function publicationToken(
  projectId: string, dataset: string, environment: string, generation: string,
): string {
  if (!/^[a-z0-9][a-z0-9_-]{0,47}$/.test(generation)) throw new PublicationConfigurationError();
  const previous = `yoramen-publication-v1:${projectId}:${dataset}:${environment}`;
  return generation === "legacy" ? previous : `${previous}:generation:${generation}`;
}

export function publicationSigningSecret(env: Environment): string {
  const secret = resolvePublicationRotation(env).primarySecret;
  if (!secret) throw new Error("Publication secret is missing");
  return secret;
}
