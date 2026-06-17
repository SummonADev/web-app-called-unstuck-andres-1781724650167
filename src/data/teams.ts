export const TEAMS: Record<string, string[]> = {
  A: ['Morocco', 'Portugal', 'Argentina', 'Egypt'],
  B: ['USA', 'England', 'Senegal', 'Ecuador'],
  C: ['Brazil', 'France', 'Colombia', 'Cameroon'],
  D: ['Germany', 'Netherlands', 'Japan', 'South Korea'],
  E: ['Spain', 'Belgium', 'Uruguay', 'Canada'],
  F: ['Italy', 'Mexico', 'Nigeria', 'Australia'],
  G: ['Croatia', 'Denmark', 'Peru', 'Tunisia'],
  H: ['Switzerland', 'Serbia', 'Ghana', 'Saudi Arabia'],
  I: ['Poland', 'Sweden', 'Chile', 'Iran'],
  J: ['Qatar', 'Costa Rica', 'Wales', 'New Zealand'],
  K: ['Algeria', 'Turkey', 'Paraguay', 'Honduras'],
  L: ['Austria', 'Czech Republic', 'Scotland', 'Jamaica'],
};

export const ALL_GROUPS = Object.keys(TEAMS);

export function getTeamFlag(team: string): string {
  const flags: Record<string, string> = {
    'Morocco': '🇲🇦', 'Portugal': '🇵🇹', 'Argentina': '🇦🇷', 'Egypt': '🇪🇬',
    'USA': '🇺🇸', 'England': '🏴\u200D☠️', 'Senegal': '🇸🇳', 'Ecuador': '🇪🇨',
    'Brazil': '🇧🇷', 'France': '🇫🇷', 'Colombia': '🇨🇴', 'Cameroon': '🇨🇲',
    'Germany': '🇩🇪', 'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'South Korea': '🇰🇷',
    'Spain': '🇪🇸', 'Belgium': '🇧🇪', 'Uruguay': '🇺🇾', 'Canada': '🇨🇦',
    'Italy': '🇮🇹', 'Mexico': '🇲🇽', 'Nigeria': '🇳🇬', 'Australia': '🇦🇺',
    'Croatia': '🇭🇷', 'Denmark': '🇩🇰', 'Peru': '🇵🇪', 'Tunisia': '🇹🇳',
    'Switzerland': '🇨🇭', 'Serbia': '🇷🇸', 'Ghana': '🇬🇭', 'Saudi Arabia': '🇸🇦',
    'Poland': '🇵🇱', 'Sweden': '🇸🇪', 'Chile': '🇨🇱', 'Iran': '🇮🇷',
    'Qatar': '🇶🇦', 'Costa Rica': '🇨🇷', 'Wales': '🏴\u200D☠️', 'New Zealand': '🇳🇿',
    'Algeria': '🇩🇿', 'Turkey': '🇹🇷', 'Paraguay': '🇵🇾', 'Honduras': '🇭🇳',
    'Austria': '🇦🇹', 'Czech Republic': '🇨🇿', 'Scotland': '🏴\u200D☠️', 'Jamaica': '🇯🇲',
  };
  return flags[team] || '🏳️';
}