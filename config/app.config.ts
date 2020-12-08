export interface AppConfig {
  apiUrl: string;
  mealUrl: string;
}

export const HOST: AppConfig = {
  apiUrl: 'http://localhost:8080/lunchtime/',
  mealUrl: 'http://localhost:8080/lunchtime/meal/'
};
