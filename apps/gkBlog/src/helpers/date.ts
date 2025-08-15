export function relativeTime(date: string | number): string {
  const current = new Date().getTime();
  const target = new Date(date).getTime();
  const diff = current - target;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) {
    return "几秒前";
  }
  if (minutes < 60) {
    return `${minutes} 分钟前`;
  }
  if (hours < 24) {
    return `${hours} 小时前`;
  }
  if (days < 30) {
    return `${days} 天前`;
  }
  if (months < 12) {
    return `${months} 个月前`;
  }
  return `${years} 年前`;
}
