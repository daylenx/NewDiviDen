# Dividend Tracker (updating) 

A modern web application for tracking and managing dividend investments, built with React, TypeScript, and Firebase.

## Features

-  User Authentication
-  Portfolio Management
-  Dividend Tracking
-  Upcoming Payout Calendar
-  Educational Resources
-  Interactive Calculators
-  Dark/Light Mode

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Firebase (Authentication & Firestore)
- Chart.js
- React Router
- React Hot Toast

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── contexts/       # React contexts (Auth, Theme, etc.)
  ├── pages/         # Page components
  ├── config/        # Configuration files
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
