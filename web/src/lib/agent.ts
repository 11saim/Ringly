const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || "http://localhost:8001";

export function triggerEmbed(
  tenantId: string,
  sourceType: "faq" | "document",
  sourceId: string,
): void {
  fetch(`${AGENT_URL}/kb/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tenant_id: tenantId,
      source_type: sourceType,
      source_id: sourceId,
    }),
  }).catch(() => {
    // Agent service unreachable — document status stays 'pending'
  });
}
