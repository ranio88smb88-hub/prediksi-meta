
export enum ScriptType {
  BOLA = 'PREDIKSI BOLA',
  TOGEL = 'PREDIKSI TOGEL',
  SYAIR = 'SYAIR TOGEL',
  BUKTI_JP = 'BUKTI JP',
  CALCULATOR = 'TOGEL CALCULATOR',
  BOLA_CALC = 'BOLA CALCULATOR'
}

export interface MatchData {
  time: string;
  teams: string;
  score: string;
}

export interface LeagueGroup {
  leagueName: string;
  matches: MatchData[];
}
