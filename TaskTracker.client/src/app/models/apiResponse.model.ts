export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  details?: string;
  errors?: string[];
  statusCode?: number;
  timestamp: Date;
}
