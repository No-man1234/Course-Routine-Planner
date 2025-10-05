// Utility to parse the lossy extracted course table text from UIU PDF
// Returns an array of course objects

function parseCourseTable(rawText) {
    const courses = [];
    
    // First, find all the course records by splitting on SL number patterns
    // The data is in one or more long lines, so we need to extract individual course entries
    const allText = rawText.replace(/\n/g, ' '); // Join all lines
    
    // Remove headers and unwanted text
    let cleanText = allText.replace(/United\s+International\s+University.*?Credit\s+/g, '');
    cleanText = cleanText.replace(/CLASS\s+ROUTINE\s+252.*?monir@admin\.uiu,ac\.bd/g, '');
    
    // Split by SL numbers to get individual course records  
    // Step 1: Find all possible course starting positions
    const courseStartPattern = /(\d+)\s+(BSCSE|BSDS)\s+[A-Z]{2,4}\s+\d{4}/g;
    const courseStarts = [];
    let match;
    while ((match = courseStartPattern.exec(cleanText)) !== null) {
        courseStarts.push({
            sl: parseInt(match[1]),
            start: match.index,
            fullMatch: match[0]
        });
    }
    
    // Step 2: Extract text between course starts
    const courseMatches = [];
    for (let i = 0; i < courseStarts.length; i++) {
        const start = courseStarts[i].start;
        const end = i < courseStarts.length - 1 ? courseStarts[i + 1].start : cleanText.length;
        const courseText = cleanText.substring(start, end);
        courseMatches.push(courseText.trim());
    }
    
    if (!courseMatches) {
        return courses;
    }
    
    for (const match of courseMatches) {
        const courseText = match.trim();
        
        // Parse each course record
        const tokens = courseText.split(/\s+/);
        let tokenIndex = 0;
        
        // SL number
        const sl = parseInt(tokens[tokenIndex++]);
        if (isNaN(sl)) continue;
        
        // Program
        const program = tokens[tokenIndex++] || '';
        
        // Course Code (two parts)
        const coursePart1 = tokens[tokenIndex++] || '';
        const coursePart2 = tokens[tokenIndex++] || '';
        const courseCode = `${coursePart1} ${coursePart2}`;
        
        // Title - find where it ends by looking for section pattern
        let title = '';
        let sectionIndex = -1;
        
        // Look for section pattern starting from current position
        for (let i = tokenIndex; i < tokens.length; i++) {
            const token = tokens[i];
            // Check if this looks like a section (A, B, AA, AB, etc.)
            // Section should be followed by either Room or Day
            if (/^[A-Z]{1,2}$/.test(token) || token.startsWith('A(If') || token.startsWith('B(If') || 
                token.startsWith('C(If') || token.startsWith('D(If') || token.startsWith('E(If') ||
                token.startsWith('F(If') || token.startsWith('G(If') || token.startsWith('H(If') ||
                token.startsWith('I(If') || token.startsWith('J(If') || token.startsWith('K(If') ||
                token.startsWith('L(If') || token.startsWith('M(If') || token.startsWith('N(If') ||
                token.startsWith('O(If') || token.startsWith('P(If') || token.startsWith('Q(If') ||
                token.startsWith('R(If') || token.startsWith('S(If') || token.startsWith('T(If') ||
                token.startsWith('U(If') || token.startsWith('V(If') || token.startsWith('W(If') ||
                token.startsWith('X(If') || token.startsWith('Y(If') || token.startsWith('Z(If') ||
                /^[A-Z]{2}\(If$/.test(token) || /^[A-Z]{1,2}\(If$/.test(token) ||
                /^[A-Z]{1,2}\(\s*If$/.test(token) || /^[A-Z]{1,2}\(\s*if$/.test(token) ||
                /^[A-Z]{1,2}\s*\(Time$/.test(token) || /^[A-Z]{1,2}\($/.test(token)) {
                
                // Check if next token looks like room/day to confirm this is section
                if (i + 1 < tokens.length) {
                    const nextToken = tokens[i + 1];
                    // Next should be room number, day, or "(If" or "(if" for "(If Required)" pattern
                    // Also handle cases where section is embedded like "M(If" or "K( If" or "C (Time"
                    // Handle "K(" followed by "If" pattern
                    if (/^\d/.test(nextToken) || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(nextToken) || 
                        nextToken === '(If' || nextToken === '(if' || nextToken === 'Required)' || 
                        nextToken === 'required)' || nextToken === 'changed)' || nextToken === 'If' || 
                        nextToken === '(Time' || nextToken === '(time' ||
                        /^[A-Z]{1,2}\(If/.test(token) || /^[A-Z]{1,2}\(\s*If/.test(token) || 
                        /^[A-Z]{1,2}\(\s*if/.test(token) || /^[A-Z]{1,2}\s*\(Time/.test(token) ||
                        (token.endsWith('(') && (nextToken === 'If' || nextToken === 'if'))) {
                        sectionIndex = i;
                        break;
                    }
                } else {
                    // If it's the last token and looks like a section, accept it
                    if (/^[A-Z]{1,2}$/.test(token) || /^[A-Z]{1,2}\(If/.test(token) || 
                        /^[A-Z]{1,2}\(\s*If/.test(token) || /^[A-Z]{1,2}\(\s*if/.test(token) || 
                        /^[A-Z]{1,2}\s*\(Time/.test(token)) {
                        sectionIndex = i;
                        break;
                    }
                }
            }
            title += (title ? ' ' : '') + token;
        }
        
        if (sectionIndex === -1) continue; // Skip if no section found
        
        // Section (handle "X (If Required)" pattern)
        let section = tokens[sectionIndex];
        tokenIndex = sectionIndex + 1;
        
        // Handle "A(If Required)" cases
        if (section.endsWith('(If') && tokenIndex < tokens.length && tokens[tokenIndex] === 'Required)') {
            section = section.replace('(If', ' (If Required)');
            tokenIndex++;
        }
        
        // Handle "A (if required)" cases (with space and lowercase/uppercase)
        if (tokenIndex < tokens.length && (tokens[tokenIndex] === '(if' || tokens[tokenIndex] === '(If')) {
            if (tokenIndex + 1 < tokens.length && (tokens[tokenIndex + 1] === 'required)' || tokens[tokenIndex + 1] === 'Required)')) {
                section = section + ' (if required)';
                tokenIndex += 2;
            }
        }
        
        // Handle embedded patterns like "M(If Required)" - extract the section letter
        if (/^[A-Z]{1,2}\(If/.test(section)) {
            const match = section.match(/^([A-Z]{1,2})\(If(.*)$/);
            if (match) {
                section = match[1] + ' (If' + match[2];
                if (tokenIndex < tokens.length && (tokens[tokenIndex] === 'Required)' || tokens[tokenIndex] === 'required)')) {
                    section = section.replace('(If', ' (If Required)');
                    tokenIndex++;
                }
            }
        }
        
        // Handle "K( If required)" patterns
        if (/^[A-Z]{1,2}\(\s*If/.test(section)) {
            const match = section.match(/^([A-Z]{1,2})\(\s*If(.*)$/);
            if (match) {
                section = match[1] + ' (If' + match[2];
                if (tokenIndex < tokens.length && (tokens[tokenIndex] === 'required)' || tokens[tokenIndex] === 'Required)')) {
                    section = section.replace('(If', ' (If required)');
                    tokenIndex++;
                }
            }
        }
        
        // Handle "K( if required)" patterns
        if (/^[A-Z]{1,2}\(\s*if/.test(section)) {
            const match = section.match(/^([A-Z]{1,2})\(\s*if(.*)$/);
            if (match) {
                section = match[1] + ' (if' + match[2];
                if (tokenIndex < tokens.length && (tokens[tokenIndex] === 'required)' || tokens[tokenIndex] === 'Required)')) {
                    section = section.replace('(if', ' (if required)');
                    tokenIndex++;
                }
            }
        }
        
        // Handle "C (Time changed)" patterns
        if (/^[A-Z]{1,2}\s*\(Time/.test(section)) {
            const match = section.match(/^([A-Z]{1,2})\s*\(Time(.*)$/);
            if (match) {
                section = match[1] + ' (Time' + match[2];
                if (tokenIndex < tokens.length && tokens[tokenIndex] === 'changed)') {
                    section = section.replace('(Time', ' (Time changed)');
                    tokenIndex++;
                }
            }
        }
        
        // Handle "K( If" patterns (section ends with "(" and next token is "If")
        if (section.endsWith('(') && tokenIndex < tokens.length && tokens[tokenIndex] === 'If') {
            if (tokenIndex + 1 < tokens.length && (tokens[tokenIndex + 1] === 'required)' || tokens[tokenIndex + 1] === 'Required)')) {
                section = section.slice(0, -1) + ' (If required)';
                tokenIndex += 2;
            } else {
                section = section.slice(0, -1) + ' (If)';
                tokenIndex++;
            }
        }
        
        // Handle "C" followed by "(Time" pattern
        if (/^[A-Z]{1,2}$/.test(section) && tokenIndex < tokens.length && tokens[tokenIndex] === '(Time') {
            if (tokenIndex + 1 < tokens.length && tokens[tokenIndex + 1] === 'changed)') {
                section = section + ' (Time changed)';
                tokenIndex += 2;
            } else {
                section = section + ' (Time)';
                tokenIndex++;
            }
        }
        
        // Find credit (last single digit in the sequence) to determine if it's a lab course
        let credit = '';
        let creditIndex = -1;
        for (let i = tokens.length - 1; i >= tokenIndex; i--) {
            if (/^\d+$/.test(tokens[i])) {
                // Only accept credits 1-4, reject anything else as it's likely part of next SL
                if (parseInt(tokens[i]) >= 1 && parseInt(tokens[i]) <= 4) {
                    credit = tokens[i];
                    creditIndex = i;
                    break;
                }
            }
        }
        
        // Determine if this is a lab course (credit = 1 OR title contains "Laboratory" or "Lab" OR room description contains "Lab")
        let isLabCourse = credit === '1' || title.includes('Laboratory') || title.includes('Lab');
        
        // Also check for lab indicators in room description (like "(Computer Lab)")
        if (!isLabCourse && creditIndex > tokenIndex) {
            // Check the first few tokens after section for lab indicators
            for (let i = tokenIndex; i < Math.min(tokenIndex + 4, creditIndex); i++) {
                if (tokens[i] && (tokens[i].includes('Lab') || tokens[i].includes('Computer'))) {
                    isLabCourse = true;
                    break;
                }
            }
        }
        
        let room1 = '';
        let room2 = '';
        let day1 = '';
        let day2 = '';
        let time1 = '';
        let time2 = '';
        let facultyName = '';
        let facultyInitial = '';
        
        if (isLabCourse) {
            // Lab course format: Section Room Day Time - Faculty Initial Credit
            
            // Room (with possible Lab designation)
            if (tokenIndex < tokens.length && !['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                room1 = tokens[tokenIndex++];
                // Handle "(Computer Lab)" or similar patterns
                while (tokenIndex < tokens.length && !['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                    room1 += ' ' + tokens[tokenIndex++];
                }
            }
            
            // Day
            if (tokenIndex < tokens.length && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                day1 = tokens[tokenIndex++];
            }
            
            // Time - look for time pattern
            if (tokenIndex < tokens.length && tokens[tokenIndex].includes(':')) {
                time1 = tokens[tokenIndex++];
                if (tokenIndex < tokens.length && tokens[tokenIndex] === '-') {
                    time1 += ' ' + tokens[tokenIndex++];
                    if (tokenIndex < tokens.length && tokens[tokenIndex].includes(':')) {
                        time1 += ' ' + tokens[tokenIndex++];
                    }
                }
            }
            
            // Skip the "-" separator
            if (tokenIndex < tokens.length && tokens[tokenIndex] === '-') {
                tokenIndex++;
            }
            
            // Faculty initial is usually right before credit
            if (creditIndex > tokenIndex) {
                facultyInitial = tokens[creditIndex - 1];
                
                // Faculty name is everything between current position and faculty initial
                const facultyTokens = tokens.slice(tokenIndex, creditIndex - 1);
                facultyName = facultyTokens.join(' ');
            }
            
        } else {
            // Regular course: Section Room1 Room2 Day1 Day2 Time1 Time2 Faculty Initial Credit
            
            // Room1
            if (tokenIndex < tokens.length && !['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                room1 = tokens[tokenIndex++];
            }
            
            // Room2 (might be same as Room1)
            if (tokenIndex < tokens.length && !['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                room2 = tokens[tokenIndex++];
            }
            
            // Day1
            if (tokenIndex < tokens.length && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                day1 = tokens[tokenIndex++];
            }
            
            // Day2
            if (tokenIndex < tokens.length && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(tokens[tokenIndex])) {
                day2 = tokens[tokenIndex++];
            }
            
            // Time1
            if (tokenIndex < tokens.length && tokens[tokenIndex].includes(':')) {
                time1 = tokens[tokenIndex++];
                if (tokenIndex < tokens.length && tokens[tokenIndex] === '-') {
                    time1 += ' ' + tokens[tokenIndex++];
                    if (tokenIndex < tokens.length && tokens[tokenIndex].includes(':')) {
                        time1 += ' ' + tokens[tokenIndex++];
                    }
                }
            }
            
            // Time2
            if (tokenIndex < tokens.length && tokens[tokenIndex].includes(':')) {
                time2 = tokens[tokenIndex++];
                if (tokenIndex < tokens.length && tokens[tokenIndex] === '-') {
                    time2 += ' ' + tokens[tokenIndex++];
                    if (tokenIndex < tokens.length && tokens[tokenIndex].includes(':')) {
                        time2 += ' ' + tokens[tokenIndex++];
                    }
                }
            }
            
            // For regular courses, find faculty and credit
            if (creditIndex > tokenIndex) {
                facultyInitial = tokens[creditIndex - 1];
                
                // Faculty name is everything between current position and faculty initial
                const facultyTokens = tokens.slice(tokenIndex, creditIndex - 1);
                facultyName = facultyTokens.join(' ');
            }
        }
        
        const course = {
            sl,
            program,
            courseCode: courseCode.trim(),
            title: title.trim(),
            section: section.trim(),
            room1: room1.trim(),
            room2: room2.trim(),
            day1: day1.trim(),
            day2: day2.trim(),
            time1: time1.trim(),
            time2: time2.trim(),
            facultyName: facultyName.trim(),
            facultyInitial: facultyInitial.trim(),
            credit: credit.trim()
        };
        
        courses.push(course);
    }
    
    return courses;
}

export default parseCourseTable; 