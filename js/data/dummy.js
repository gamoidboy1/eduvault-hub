// js/data/dummy.js — EduConnect Hub v1.1 — Added Faculty Profile Images

window.DUMMY = {

    currentUser: {},

    subjects: [
        {
            id: 'CY301', name: 'Network Security', code: 'CY301', teacher: 'Dr. Anil Sharma',
            modules: 4, icon: '🌐', profImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            description: 'Fundamentals of securing networks, firewalls, IDS/IPS and VPNs.',
            syllabus: ['Network threats & attack vectors', 'Firewalls & packet filtering', 'Intrusion Detection & Prevention Systems', 'VPNs, IPSec & TLS/SSL', 'Network monitoring & forensics'],
            outcomes: ['Analyze network vulnerabilities', 'Configure firewalls & IDS rules', 'Implement VPN solutions', 'Respond to network incidents'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Explain stateful inspection in firewalls.', 'Compare IDS vs IPS with examples.', 'Describe the IPSec protocol suite.'] },
                { year: '2023', sem: 'IE1', qs: ['What is a DMZ? Explain with a diagram.', 'List OSI model layers and associated threats.'] },
            ]
        },
        {
            id: 'CY302', name: 'Cryptography', code: 'CY302', teacher: 'Prof. Meena Iyer',
            modules: 5, icon: '🔑', profImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            description: 'Symmetric & asymmetric encryption, hashing, PKI, digital signatures.',
            syllabus: ['Classical ciphers & Shannon theory', 'Symmetric encryption — AES, DES', 'Asymmetric encryption — RSA, ECC', 'Hash functions & MAC', 'PKI & digital certificates'],
            outcomes: ['Implement encryption algorithms', 'Design PKI infrastructure', 'Apply hashing for data integrity', 'Evaluate cryptographic protocols'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Explain RSA with a worked example.', 'What are the AES key expansion steps?', 'Compare DES and 3DES.'] },
                { year: '2023', sem: 'IE1', qs: ['Describe Caesar cipher and its weakness.', 'What is a digital signature? How does it work?'] },
            ]
        },
        {
            id: 'CY303', name: 'Ethical Hacking', code: 'CY303', teacher: 'Dr. Anil Sharma',
            modules: 6, icon: '💻', profImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            description: 'Penetration testing lifecycle, vulnerability assessment, exploitation.',
            syllabus: ['Penetration testing phases', 'Reconnaissance & OSINT', 'Scanning & enumeration', 'Exploitation techniques', 'Post-exploitation & reporting'],
            outcomes: ['Conduct ethical pen tests', 'Use tools like Nmap, Metasploit', 'Write professional pen test reports', 'Identify and exploit common vulnerabilities'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Explain the phases of penetration testing.', 'What is OSINT? Give 3 tools used.', 'Describe a buffer overflow attack.'] },
                { year: '2023', sem: 'IE1', qs: ['Difference between vulnerability assessment and pen testing.', 'What is a CVE? How is it scored?'] },
            ]
        },
        {
            id: 'CY304', name: 'Digital Forensics', code: 'CY304', teacher: 'Prof. Sujatha Nair',
            modules: 4, icon: '🔍', profImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            description: 'Evidence collection, disk imaging, memory forensics and incident response.',
            syllabus: ['Forensic investigation process', 'Disk imaging & chain of custody', 'File system analysis (NTFS, ext4)', 'Memory & network forensics', 'Incident response procedures'],
            outcomes: ['Preserve digital evidence legally', 'Perform disk & memory forensics', 'Use Autopsy, Volatility tools', 'Write forensic investigation reports'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['What is chain of custody? Why is it important?', 'Explain the process of disk imaging.', 'How does Volatility help in memory forensics?'] },
                { year: '2023', sem: 'IE1', qs: ['Define digital forensics.', 'List steps in incident response.'] },
            ]
        },
        {
            id: 'CY305', name: 'Malware Analysis', code: 'CY305', teacher: 'Dr. Vikram Das',
            modules: 3, icon: '🦠', profImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            description: 'Static and dynamic analysis of malware, reverse engineering and sandboxing.',
            syllabus: ['Malware types & taxonomy', 'Static analysis techniques', 'Dynamic analysis & sandboxing', 'Reverse engineering basics', 'Anti-analysis techniques'],
            outcomes: ['Classify and analyze malware samples', 'Use IDA Pro and Ghidra', 'Set up sandbox environments', 'Write malware analysis reports'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Differentiate static and dynamic analysis.', 'What is a sandbox? Name two sandboxing tools.', 'Describe common obfuscation techniques in malware.'] },
                { year: '2023', sem: 'IE1', qs: ['What is a RAT? How does it operate?', 'Explain the PE file format.'] },
            ]
        },
        {
            id: 'CY306', name: 'Web Security', code: 'CY306', teacher: 'Prof. Priya Menon',
            modules: 4, icon: '🕸️', profImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            description: 'OWASP Top 10, XSS, SQLi, CSRF, API security and secure coding.',
            syllabus: ['OWASP Top 10 vulnerabilities', 'SQL Injection & prevention', 'XSS — reflected, stored, DOM', 'CSRF & clickjacking', 'API security & JWT'],
            outcomes: ['Identify & exploit OWASP Top 10', 'Implement secure coding practices', 'Perform web app pen tests', 'Secure REST APIs'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Explain SQL injection with an example.', 'What is stored XSS? How to prevent it?', 'Describe the CSRF attack flow.'] },
                { year: '2023', sem: 'IE1', qs: ['List five OWASP Top 10 risks.', 'What is clickjacking? Give a mitigation.'] },
            ]
        },
        {
            id: 'MA201', name: 'Discrete Mathematics', code: 'MA201', teacher: 'Dr. Thomas George',
            modules: 5, icon: '📐', profImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            description: 'Logic, sets, graph theory, combinatorics and number theory.',
            syllabus: ['Propositional & predicate logic', 'Set theory & relations', 'Graph theory fundamentals', 'Combinatorics & counting', 'Number theory & modular arithmetic'],
            outcomes: ['Apply logic to problem solving', 'Analyze graphs and trees', 'Use modular arithmetic in cryptography', 'Count combinations and permutations'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Prove that √2 is irrational.', 'Find the chromatic number of K4.', 'Apply Fermat\'s little theorem to compute 3^100 mod 7.'] },
                { year: '2023', sem: 'IE1', qs: ['What is a bipartite graph?', 'Simplify the Boolean expression AB+A\'B.'] },
            ]
        },
        {
            id: 'CY308', name: 'Cloud Security', code: 'CY308', teacher: 'Prof. Divya Krishnan',
            modules: 3, icon: '☁️', profImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
            description: 'Cloud architecture security, AWS/Azure IAM, data protection.',
            syllabus: ['Cloud deployment models', 'IAM — roles, policies, MFA', 'Data encryption at rest & transit', 'Container & serverless security', 'Cloud compliance & auditing'],
            outcomes: ['Configure IAM on AWS/Azure', 'Implement cloud encryption', 'Assess cloud misconfigurations', 'Apply cloud compliance frameworks'],
            pyq: [
                { year: '2024', sem: 'End Sem', qs: ['Compare IaaS, PaaS, SaaS security responsibilities.', 'What are the risks of misconfigured S3 buckets?', 'Explain the shared responsibility model.'] },
                { year: '2023', sem: 'IE1', qs: ['What is IAM? List its key components.', 'Describe data residency issues in cloud.'] },
            ]
        },
    ],

    // ── Faculty teaching structure ────────────────────────────────────────────
    facultyBatches: [
        {
            batchCode: 'CS-CY-2025-A',
            branch: 'CS Cybersecurity',
            year: '3rd Year',
            students: 64,
            subjects: ['CY301', 'CY303']
        },
        {
            batchCode: 'CS-CY-2025-B',
            branch: 'CS Cybersecurity',
            year: '3rd Year',
            students: 58,
            subjects: ['CY301', 'CY302']
        }
    ],

    modules: {},

    announcements: [
        { id: 'ann-1', title: 'Mid-term results are out', category: 'General', time: '2 hours ago', icon: '📢' },
        { id: 'ann-2', title: 'Seminar on Quantum Cryptography', category: 'Event', time: '5 hours ago', icon: '🌟' },
    ],

    dashStats: {
        totalSubjects: 8,
        activeModules: 24,
        avgSyllabus: '76%',
        studentsOnline: 247
    }
};
