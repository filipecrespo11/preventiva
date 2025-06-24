// filepath: c:\Users\filipe.crespo\preventiva\preventiva\app\types.ts
export interface AgendaItem {
  tipo_manutencao: string;
  setor: string;
  serviceTag: string;
  data?: string; // adicione se precisar da data no relatório
}