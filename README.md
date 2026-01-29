# KLU Attendance Calculator

A modern, responsive web application for KLU students to calculate their attendance percentages, track eligibility, and manage saved calculations.

![KLU Attendance Calculator](public/KL_University_logo.svg)

## Features

- **Simple Attendance Calculator**: Calculate attendance percentage based on total classes and classes attended
- **LTPS Calculator**: Advanced calculator for Lecture, Tutorial, Practical, and Skilling components
- **Screenshot Calculator**: Upload a screenshot of your attendance table for automatic extraction and calculation
- **Attendance Analysis**: Check eligibility status based on university attendance requirements (75% and 85%)
- **Save Calculations**: Save your calculations as drafts with subject names
- **Draft Management**: View, load, and delete saved drafts
- **Responsive Design**: Works on all devices from mobile to desktop
- **Dark/Light Mode**: Toggle between color themes

## Technologies Used

- **Next.js 15**: React framework for production
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Radix UI**: Accessible component primitives
- **js-cookie**: Cookie management for saved drafts
- **OCR.space API**: Optical Character Recognition for text extraction

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/klu-attendance-calculator.git
   cd klu-attendance-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Simple Calculator

1. Navigate to the Simple Calculator page
2. Enter the total number of classes
3. Enter the number of classes attended
4. Enter subject name (optional, for saving)
5. Click "Calculate" to see your attendance percentage and eligibility status

### LTPS Calculator

1. Navigate to the LTPS Calculator page
2. Enter attendance percentages for each component (Lecture, Tutorial, Practical, Skilling)
3. Enter subject name (optional, for saving)
4. Click "Calculate" to see your weighted attendance percentage and eligibility status

### Screenshot Calculator

1. Navigate to the Screenshot Calculator page
2. Upload a screenshot of your attendance table
3. The app will automatically extract course details and attendance numbers
4. View detailed analysis including skippable classes and required attendance
5. Save the results for future reference

### Managing Saved Drafts

- Saved drafts appear below the calculator
- Click on a draft to load its values into the calculator
- Click the "X" button to delete a draft

## Deployment

The project is configured for static export and can be deployed to any static hosting platform:

1. Build the project:
   ```bash
   npm run build
   ```

2. The `out` directory will contain the static files for deployment

3. Upload the contents of the `out` directory to your hosting provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
