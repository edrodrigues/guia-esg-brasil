import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Note: You need a service account key file to run this script.
const SERVICE_ACCOUNT_PATH = path.join(__dirname, './service-account.json');

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('Error: service-account.json not found at', SERVICE_ACCOUNT_PATH);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

async function importQuestions() {
  const formsDir = path.join(__dirname, '../Forms');
  const files = [
    '2. SIMB 2024 - FORM.json',
    '3. SIMB 2024 - AMBIENTAL.json',
    '4. SIMB 2024 - SOCIAL.json',
    '5. SIMB 2024 - GOVERNANÇA.json'
  ];

  let allQuestions: any[] = [];

  for (const file of files) {
    const filePath = path.join(formsDir, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File ${filePath} not found. Skipping.`);
        continue;
    }
    console.log(`Reading ${file}...`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    allQuestions = [...allQuestions, ...content];
  }

  console.log(`Total questions to upload: ${allQuestions.length}. Uploading to Firestore...`);

  const batchSize = 500;
  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = db.batch();
    const chunk = allQuestions.slice(i, i + batchSize);
    
    chunk.forEach(q => {
      const docRef = db.collection('questions').doc(q.id);
      batch.set(docRef, q);
    });

    await batch.commit();
    console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}`);
  }

  console.log('Import completed successfully!');
  
  // Também atualizar o arquivo local para referência
  const localQuestionsPath = path.join(__dirname, '../src/data/questions.ts');
  const fileContent = `import { Question } from '../types';

export const diagnosticQuestions: Question[] = ${JSON.stringify(allQuestions, null, 2)};
`;
  fs.writeFileSync(localQuestionsPath, fileContent);
  console.log('Updated src/data/questions.ts with parity data.');
}

importQuestions().catch(console.error);
