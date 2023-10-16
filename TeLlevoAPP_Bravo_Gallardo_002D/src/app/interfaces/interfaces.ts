export interface RespuestaTopHeadlines  {
    
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
      time: string;
      temperature_2m: string;
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
    };
    daily_units: {
      time: string;
      temperature_2m_max: string;
      temperature_2m_min: string;
    };
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
}