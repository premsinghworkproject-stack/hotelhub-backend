import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getRoot(@Res() res: Response) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hotel Booking System - GraphQL API</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 2.5em;
          }
          .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.2em;
          }
          .links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .btn {
            display: inline-block;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            transition: all 0.3s ease;
            color: white;
          }
          .btn-primary {
            background: #007bff;
          }
          .btn-primary:hover {
            background: #0056b3;
            transform: translateY(-2px);
          }
          .btn-secondary {
            background: #28a745;
          }
          .btn-secondary:hover {
            background: #1e7e34;
            transform: translateY(-2px);
          }
          .btn-info {
            background: #17a2b8;
          }
          .btn-info:hover {
            background: #117a8b;
            transform: translateY(-2px);
          }
          .features {
            margin-top: 30px;
            text-align: left;
          }
          .feature {
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #007bff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏨 Hotel Booking System</h1>
          <p class="subtitle">GraphQL API with Authentication & Email Services</p>
          
          <div class="links">
            <a href="/graphql" class="btn btn-primary">🚀 GraphQL Playground</a>
            <a href="/docs" class="btn btn-secondary">📚 API Documentation</a>
            <a href="/graphql" class="btn btn-info">🔍 Explore Schema</a>
          </div>

          <div class="features">
            <div class="feature">
              <strong>🔐 Authentication:</strong> JWT-based auth with OTP verification
            </div>
            <div class="feature">
              <strong>📧 Email Services:</strong> Dynamic email templates with SMTP
            </div>
            <div class="feature">
              <strong>🏨 Hotel Management:</strong> Complete CRUD operations
            </div>
            <div class="feature">
              <strong>📅 Booking System:</strong> Room reservations with validation
            </div>
            <div class="feature">
              <strong>👥 User Management:</strong> Secure user profiles and data
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Hotel Booking GraphQL API',
      version: '1.0.0'
    };
  }
}
