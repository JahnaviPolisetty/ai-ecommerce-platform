import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import natural from 'natural';

let productsData = [];
let tfidf = new natural.TfIdf();
let docVectors = []; 
let isReady = false;

// Preprocess string
const preprocess = (text) => {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
};

export const initRecommender = () => {
  return new Promise((resolve, reject) => {
    // Look up one folder to model directory
    const csvPath = process.env.ML_DATASET_PATH || path.resolve(process.cwd(), '../model/7817_1.csv');
    console.log(`[ML] Loading dataset from ${csvPath}`);
    
    if (!fs.existsSync(csvPath)) {
      console.warn(`[ML] Dataset not found at ${csvPath}. Engine will be disabled. Create a mock or link the real one.`);
      return resolve();
    }

    let count = 0;
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
          // Look for potential name and description fields
          const name = row.product_name || row.name || Object.values(row)[1] || '';
          
          // Deduplicate if name already exists since this might be a reviews dataset
          const exists = productsData.find(p => (p.product_name || p.name || Object.values(p)[1] || '') === name);
          
          if (!exists && count < 2500) {
            productsData.push(row);
            const desc = row.description || row.about_product || Object.values(row)[2] || '';
            
            const text = preprocess(`${name} ${desc}`);
            tfidf.addDocument(text);
            count++;
          }
      })
      .on('end', () => {
        console.log(`[ML] Loaded ${productsData.length} records. Computing TF-IDF vectors...`);
        // Pre-compute dict array of TF-IDF vectors
        for (let i = 0; i < productsData.length; i++) {
            const termsMap = {};
            tfidf.listTerms(i).forEach(item => {
                termsMap[item.term] = item.tfidf;
            });
            docVectors.push(termsMap);
        }
        isReady = true;
        console.log(`[ML] Recommendation engine ready.`);
        resolve();
      })
      .on('error', (err) => {
        console.error('[ML] Error reading CSV:', err);
        resolve(); // resolve anyway so we don't block server startup
      });
  });
};

export const getCatalog = () => productsData;

const magnitude = (vec) => {
  let sum = 0;
  for (const key in vec) sum += vec[key] * vec[key];
  return Math.sqrt(sum);
};

const cosineSimilarity = (vecA, vecB) => {
  let dot = 0;
  for (const key in vecA) {
      if (vecB[key]) dot += vecA[key] * vecB[key];
  }
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  if(magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

export const getRecommendations = (targetProductId) => {
  if (!isReady) return [];
  
  // Need to find index of the target
  const targetIndex = productsData.findIndex(p => 
     p.product_id === targetProductId || p.id === targetProductId || Object.values(p)[0] === targetProductId
  );
  
  if (targetIndex === -1) return [];

  const targetTerms = docVectors[targetIndex];
  
  let similarities = [];
  for (let i = 0; i < docVectors.length; i++) {
    if (i === targetIndex) continue;
    const sim = cosineSimilarity(targetTerms, docVectors[i]);
    similarities.push({ score: sim, product: productsData[i] });
  }

  // Sort and return top 5
  similarities.sort((a, b) => b.score - a.score);
  return similarities.slice(0, 5).map(s => s.product);
};
