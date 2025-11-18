export enum ImageAction {
  KEEP = 'KEEP',
  STAGE = 'STAGE',
  EMPTY = 'EMPTY'
}

export enum AdAudience {
  FAMILIES = 'Familias',
  COUPLES = 'Parejas jóvenes',
  INVESTORS = 'Inversores',
  STUDENTS = 'Estudiantes',
  LUXURY = 'Compradores de lujo'
}

export enum AdLength {
  SHORT = 'Corto y directo (Twitter/Instagram)',
  MEDIUM = 'Medio (Idealista/Fotocasa)',
  LONG = 'Largo y detallado (Web propia/Blog)'
}

export enum AdTone {
  PROFESSIONAL = 'Profesional y serio',
  EMOTIONAL = 'Emocional y cercano',
  URGENT = 'Oportunidad urgente',
  MINIMALIST = 'Minimalista y elegante'
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  selectedAction: ImageAction;
  processedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface AdSettings {
  audience: AdAudience;
  length: AdLength;
  tone: AdTone;
}

export interface GenerationResult {
  adText: string;
  images: UploadedImage[];
}