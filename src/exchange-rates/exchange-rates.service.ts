import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExchangeRatesService {
    private baseUrl = 'http://api.exchangeratesapi.io/v1';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getLatestRates(base: string, symbols: string): Promise<any> {
    const url = `${this.baseUrl}/latest`;
    const params = {
      access_key: this.configService.get<string>('EXCHANGERATES_API_KEY'),
      base,
      symbols,
    };

    const response = this.httpService.get(url, { params });
    const result = await lastValueFrom(response).then(res => res.data);
    return `
            <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color:rgba(245, 245, 245, 0.5);
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Exchange Rates</h1>
                    <p>Currency: ${base}</p>
                    <p>Rates:</p>
                    <ul>
                        ${Object.keys(result.rates)
                          .map(
                            key =>
                              `<li>${key}: ${result.rates[key].toFixed(2)}</li>`,
                          )
                          .join('')}
                    </ul>
                </div>
            </body>
            </html>
        `;
  }

  async getHistoricalRates(date: string, base: string, symbols: string): Promise<any> {
    const url = `${this.baseUrl}/${date}`;
    const params = {
      access_key: this.configService.get<string>('EXCHANGERATES_API_KEY'),
      base,
      symbols,
    };

    const response = this.httpService.get(url, { params });
    const result = await lastValueFrom(response).then(res => res.data);
    return `
            <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color:rgba(245, 245, 245, 0.5);
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Exchange Rates for ${new Date(date).toLocaleDateString()}</h1>
                    <p>Date: ${new Date(date).toLocaleDateString()}</p>
                    <p>Currency: ${base}</p>
                    <p>Rates for:</p>
                    <ul>
                        ${Object.keys(result.rates)
                          .map(
                            key =>
                              `<li>${key}: ${result.rates[key].toFixed(2)}</li>`,
                          )
                          .join('')}
                    </ul>
                </div>
            </body>
            </html>
        `;
  }
}
