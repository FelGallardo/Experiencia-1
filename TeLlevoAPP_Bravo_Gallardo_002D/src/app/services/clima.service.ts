import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespuestaTopHeadlines } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {


  
  constructor(private Http : HttpClient) { }


  getTopHeadLines(){
    return this.Http.get<RespuestaTopHeadlines>('https://api.open-meteo.com/v1/forecast?latitude=-33.4569&longitude=-70.6483&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto');
  }
}