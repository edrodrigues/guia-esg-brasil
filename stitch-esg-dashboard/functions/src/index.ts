import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Types
interface Company {
  id: string;
  name: string;
  industry?: string;
  region: string;
  esgScores: {
    environmental: number;
    social: number;
    governance: number;
  };
}

interface RegionalAverages {
  region: string;
  avgEnvironmental: number;
  avgSocial: number;
  avgGovernance: number;
  avgTotal: number;
  totalCompanies: number;
  updatedAt: admin.firestore.Timestamp;
}

/**
 * Calculate and update regional averages for ESG scores
 * This function can be called manually or scheduled to run weekly
 */
export const calculateRegionalAverages = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get all companies
    const companiesSnapshot = await db.collection('companies').get();
    const companies = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Company[];

    // Group by region
    const regionGroups: { [key: string]: Company[] } = {};
    companies.forEach(company => {
      const region = company.region || 'Outros';
      if (!regionGroups[region]) {
        regionGroups[region] = [];
      }
      regionGroups[region].push(company);
    });

    // Calculate averages for each region
    const batch = db.batch();
    const timestamp = admin.firestore.Timestamp.now();

    for (const [region, regionCompanies] of Object.entries(regionGroups)) {
      if (regionCompanies.length === 0) continue;

      const avgEnvironmental = Math.round(
        regionCompanies.reduce((sum, c) => sum + (c.esgScores?.environmental || 0), 0) / regionCompanies.length
      );
      const avgSocial = Math.round(
        regionCompanies.reduce((sum, c) => sum + (c.esgScores?.social || 0), 0) / regionCompanies.length
      );
      const avgGovernance = Math.round(
        regionCompanies.reduce((sum, c) => sum + (c.esgScores?.governance || 0), 0) / regionCompanies.length
      );
      const avgTotal = Math.round((avgEnvironmental + avgSocial + avgGovernance) / 3);

      const regionalData: RegionalAverages = {
        region,
        avgEnvironmental,
        avgSocial,
        avgGovernance,
        avgTotal,
        totalCompanies: regionCompanies.length,
        updatedAt: timestamp,
      };

      const docRef = db.collection('regionalAverages').doc(region);
      batch.set(docRef, regionalData, { merge: true });
    }

    await batch.commit();

    return {
      success: true,
      message: `Calculated averages for ${Object.keys(regionGroups).length} regions`,
      regions: Object.keys(regionGroups),
    };
  } catch (error) {
    console.error('Error calculating regional averages:', error);
    throw new functions.https.HttpsError('internal', 'Failed to calculate regional averages');
  }
});

/**
 * Update evolution data for all companies
 * This function should be scheduled to run monthly to archive current scores
 */
export const updateEvolutionData = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const currentMonth = new Date().toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    const currentYear = new Date().getFullYear();
    const timestamp = admin.firestore.Timestamp.now();

    // Get all companies
    const companiesSnapshot = await db.collection('companies').get();
    const batch = db.batch();

    companiesSnapshot.docs.forEach(doc => {
      const company = doc.data() as Company;
      
      // Get current evolution data or initialize
      const evolutionData = company.evolutionData || [];
      
      // Create new evolution point
      const newEvolutionPoint = {
        month: currentMonth,
        year: currentYear,
        environmental: company.esgScores?.environmental || 0,
        social: company.esgScores?.social || 0,
        governance: company.esgScores?.governance || 0,
        average: Math.round(
          ((company.esgScores?.environmental || 0) + 
           (company.esgScores?.social || 0) + 
           (company.esgScores?.governance || 0)) / 3
        ),
      };

      // Add to evolution data (keep last 12 months)
      const updatedEvolution = [...evolutionData, newEvolutionPoint].slice(-12);

      // Update company document
      batch.update(doc.ref, {
        evolutionData: updatedEvolution,
        lastEvolutionUpdate: timestamp,
      });
    });

    await batch.commit();

    return {
      success: true,
      message: `Updated evolution data for ${companiesSnapshot.size} companies`,
      month: currentMonth,
      year: currentYear,
    };
  } catch (error) {
    console.error('Error updating evolution data:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update evolution data');
  }
});

/**
 * Scheduled function to calculate regional averages weekly
 * Runs every Monday at 9:00 AM
 */
export const scheduledCalculateRegionalAverages = functions.pubsub
  .schedule('0 9 * * 1')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    try {
      console.log('Starting scheduled regional averages calculation...');
      
      // Get all companies
      const companiesSnapshot = await db.collection('companies').get();
      const companies = companiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Company[];

      // Group by region
      const regionGroups: { [key: string]: Company[] } = {};
      companies.forEach(company => {
        const region = company.region || 'Outros';
        if (!regionGroups[region]) {
          regionGroups[region] = [];
        }
        regionGroups[region].push(company);
      });

      // Calculate averages for each region
      const batch = db.batch();
      const timestamp = admin.firestore.Timestamp.now();

      for (const [region, regionCompanies] of Object.entries(regionGroups)) {
        if (regionCompanies.length === 0) continue;

        const avgEnvironmental = Math.round(
          regionCompanies.reduce((sum, c) => sum + (c.esgScores?.environmental || 0), 0) / regionCompanies.length
        );
        const avgSocial = Math.round(
          regionCompanies.reduce((sum, c) => sum + (c.esgScores?.social || 0), 0) / regionCompanies.length
        );
        const avgGovernance = Math.round(
          regionCompanies.reduce((sum, c) => sum + (c.esgScores?.governance || 0), 0) / regionCompanies.length
        );
        const avgTotal = Math.round((avgEnvironmental + avgSocial + avgGovernance) / 3);

        const regionalData: RegionalAverages = {
          region,
          avgEnvironmental,
          avgSocial,
          avgGovernance,
          avgTotal,
          totalCompanies: regionCompanies.length,
          updatedAt: timestamp,
        };

        const docRef = db.collection('regionalAverages').doc(region);
        batch.set(docRef, regionalData, { merge: true });
      }

      await batch.commit();

      console.log(`Successfully calculated averages for ${Object.keys(regionGroups).length} regions`);
      return null;
    } catch (error) {
      console.error('Error in scheduled regional averages calculation:', error);
      return null;
    }
  });

/**
 * Scheduled function to update evolution data monthly
 * Runs on the 1st of every month at 00:00
 */
export const scheduledUpdateEvolutionData = functions.pubsub
  .schedule('0 0 1 * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    try {
      console.log('Starting scheduled evolution data update...');
      
      const currentMonth = new Date().toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
      const currentYear = new Date().getFullYear();
      const timestamp = admin.firestore.Timestamp.now();

      // Get all companies
      const companiesSnapshot = await db.collection('companies').get();
      const batch = db.batch();

      companiesSnapshot.docs.forEach(doc => {
        const company = doc.data() as Company;
        
        // Get current evolution data or initialize
        const evolutionData = company.evolutionData || [];
        
        // Create new evolution point
        const newEvolutionPoint = {
          month: currentMonth,
          year: currentYear,
          environmental: company.esgScores?.environmental || 0,
          social: company.esgScores?.social || 0,
          governance: company.esgScores?.governance || 0,
          average: Math.round(
            ((company.esgScores?.environmental || 0) + 
             (company.esgScores?.social || 0) + 
             (company.esgScores?.governance || 0)) / 3
          ),
        };

        // Add to evolution data (keep last 12 months)
        const updatedEvolution = [...evolutionData, newEvolutionPoint].slice(-12);

        // Update company document
        batch.update(doc.ref, {
          evolutionData: updatedEvolution,
          lastEvolutionUpdate: timestamp,
        });
      });

      await batch.commit();

      console.log(`Successfully updated evolution data for ${companiesSnapshot.size} companies`);
      return null;
    } catch (error) {
      console.error('Error in scheduled evolution data update:', error);
      return null;
    }
  });
