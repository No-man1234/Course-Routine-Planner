# Course Routine Planner

A web application that helps university students automatically generate optimal course routines for the upcoming semester. Students can upload their university's course offering PDF and receive personalized routine suggestions based on their preferences.

## Features

### 🎯 **Core Functionality**
- **PDF Upload & Parsing**: Upload university course offering PDFs and automatically extract course data
- **Course Selection**: Choose which courses to include in your routine
- **Preference Setting**: Set preferred faculty and earliest class start time
- **Routine Generation**: Generate all possible valid routines without time conflicts
- **Smart Ranking**: Routines are ranked by how well they match your preferences
- **Warning System**: Each routine shows warnings for any mismatches with your preferences

### 📋 **Step-by-Step Process**
1. **Upload PDF**: Upload your university's course offering PDF
2. **Select Courses**: Choose which courses you want to take
3. **Set Preferences**: Choose preferred faculty and earliest start time
4. **Generate Routines**: Get all possible routines ranked by preference match

### ⚡ **Smart Features**
- **Conflict Detection**: Automatically filters out routines with time conflicts
- **Preference Matching**: Ranks routines based on faculty and timing preferences
- **Warning System**: Shows warnings for non-preferred faculty or early start times
- **Sorting Options**: Sort routines by score, warnings, or start time
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19, Tailwind CSS
- **PDF Processing**: PDF.js for parsing course PDFs
- **Build Tool**: Vite
- **Language**: JavaScript/JSX

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/course-routine-planner.git
   cd course-routine-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run serve           # Start server accessible on network (for mobile testing)

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Maintenance
npm run clean           # Clean build artifacts and cache
npm run clean:all       # Clean everything and reinstall dependencies
npm run lint            # Run ESLint for code quality

# Mobile Testing
npm run serve           # Then access from mobile: http://[your-ip]:3000
```

4. **Open your browser** and navigate to `http://localhost:5173`

## Usage

### 1. Upload Course PDF
- Click "Upload your course PDF" and select your university's course offering PDF
- The application will automatically parse the PDF and extract course data
- You'll see a success message with the number of parsed course sections

### 2. Select Courses
- Browse through available courses or use the search function
- Click on courses to select them for your routine
- View selected courses summary including total credits

### 3. Set Preferences
- **Timing**: Set your preferred earliest class start time
- **Faculty**: Choose preferred faculty for each course (optional)
- These preferences will be used to rank routine suggestions

### 4. Generate Routines
- View all possible valid routines ranked by preference match
- Each routine shows:
  - Match score and quality label (Excellent, Good, Fair, Poor)
  - Warnings for any preference mismatches
  - Complete schedule with courses, sections, faculty, and timings
- Sort routines by score, warnings, or start time

## PDF Format Requirements

The application is designed to work with university course offering PDFs that contain:
- Course codes and titles
- Section information
- Faculty names and initials
- Class timings and days
- Room numbers
- Credit information

The parser is robust and handles various PDF formats, including lossy table structures.

## Warning System

The application provides helpful warnings for:
- **Faculty Mismatch**: When a routine includes a faculty member other than your preferred choice
- **Early Start Time**: When a class starts before your preferred earliest start time
- **Time Conflicts**: Automatically filtered out, so no conflicting routines are shown

## Scoring System

Routines are scored based on:
- **+10 points**: For each course with your preferred faculty
- **-5 points**: For each class starting before your preferred time
- **Quality Labels**:
  - Excellent: Score ≥ 50
  - Good: Score ≥ 20
  - Fair: Score ≥ 0
  - Poor: Score < 0

## Development

### Project Structure
```
src/
├── App.jsx                 # Main application component
├── CourseRoutinePlanner.jsx # Main planner with step navigation
├── PdfUploadAndParse.jsx   # PDF upload and parsing
├── CourseSelection.jsx     # Course selection interface
├── PreferenceSettings.jsx  # Preference configuration
├── RoutineGenerator.jsx    # Routine generation and display
├── parseCourseTable.js     # PDF parsing logic
└── main.jsx               # Application entry point
```

### Key Algorithms

#### Routine Generation
1. **Combination Generation**: Creates all possible combinations of sections for selected courses
2. **Conflict Detection**: Filters out routines with time conflicts using time range overlap detection
3. **Preference Scoring**: Ranks routines based on faculty and timing preferences
4. **Warning Generation**: Identifies and displays preference mismatches

#### Time Conflict Detection
- Parses time ranges (e.g., "10:00 - 11:20")
- Checks for overlaps between different sections
- Handles multiple time slots per course (day1/time1, day2/time2)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure your PDF format is compatible
3. Try with different course combinations
4. Create an issue on GitHub with details about your problem

## Roadmap

- [ ] Support for more PDF formats
- [ ] Export routine to calendar applications
- [ ] Save and load preferences
- [ ] Multiple semester planning
- [ ] Advanced conflict resolution
- [ ] Room capacity and availability checking

---

**Made with ❤️ to help students create better course routines**
