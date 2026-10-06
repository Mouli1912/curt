const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../src/data/questions.json'),
  path.join(__dirname, '../../data/question_bank.json')
];

targetFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const questions = JSON.parse(raw);

    const updated = questions.map(q => {
      // Assign realistic item discrimination (a parameter, typically 0.8 - 2.2)
      let discrimination = 1.2;
      const diff = q.difficulty || 1000;

      if (diff >= 1400) {
        discrimination = 2.0; // High discrimination for advanced questions
      } else if (diff >= 1200) {
        discrimination = 1.6;
      } else if (diff >= 1000) {
        discrimination = 1.3;
      } else {
        discrimination = 0.9; // Lower discrimination for introductory questions
      }

      return {
        ...q,
        discrimination
      };
    });

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    console.log(`Calibrated ${updated.length} questions in ${filePath}`);
  }
});
