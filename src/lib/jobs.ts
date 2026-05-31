/** Reported when the job was updated after it was first created. */
export function isJobReported(createdAt: string, updatedAt: string): boolean {
  const created = Date.parse(createdAt);
  const updated = Date.parse(updatedAt);

  if (Number.isNaN(created) || Number.isNaN(updated)) {
    return false;
  }

  return created !== updated;
}

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function truncateLink(link: string, maxLength = 48): string {
  if (link.length <= maxLength) return link;
  return `${link.slice(0, maxLength)}…`;
}
