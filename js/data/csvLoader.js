// js/data/csvLoader.js — Dedicated loader to parse CSV files handling student & branch data

window.CSVData = {
    students: [],
    branches: {},
    
    // Fallbacks provided in case this is run via direct file:// without a server
    // (most browsers block fetch() on file system due to CORS)
    fallbackStudents: `email,name,roll,branch,sem,cgpa,role,password
jude@college.edu,Jude C J,25CY308,CS Cybersecurity,1st,9.1,student,cyber308
rahul@college.edu,Rahul Kumar,25CY309,CS Cybersecurity,1st,8.5,student,student123
prof.verma@college.edu,Prof. Anil Sharma,FAC-001,CS Cybersecurity,,,faculty,faculty123`,

    fallbackBranches: `branch,courses
CS Cybersecurity,"CY301,CY302,CY303,CY304,CY305,CY306,MA201,CY308"
CS AI & Machine Learning,"CY301,MA201"`,

    async load() {
        let studentText = this.fallbackStudents;
        let branchText = this.fallbackBranches;

        try {
            // Attempt to fetch actual files
            const sResp = await fetch('data/students.csv');
            if (sResp.ok) studentText = await sResp.text();

            const bResp = await fetch('data/branches.csv');
            if (bResp.ok) branchText = await bResp.text();
            console.log('Successfully loaded actual CSV files.');
        } catch(e) {
            console.warn('CSV Fetch failed (probably running via file://). Using fallback CSV string.');
        }

        this.students = this.parseCSV(studentText);
        const branchArr = this.parseCSV(branchText);
        
        branchArr.forEach(b => {
            if (b.branch && b.courses) {
                this.branches[b.branch] = b.courses.replace(/^"|"$/g, '').split(',').map(c => c.trim());
            }
        });
    },

    parseCSV(str) {
        const lines = str.trim().split(/\r?\n/);
        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;
            
            let cols = [];
            let inQuotes = false;
            let currentStr = '';
            
            for (let char of line) {
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    cols.push(currentStr.trim());
                    currentStr = '';
                } else currentStr += char;
            }
            cols.push(currentStr.trim());
            
            let obj = {};
            for (let j = 0; j < headers.length; j++) {
                let val = (cols[j] || '').replace(/^"|"$/g, '');
                obj[headers[j]] = val;
            }
            result.push(obj);
        }
        return result;
    }
};
