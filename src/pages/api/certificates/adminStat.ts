import { db } from 'firebase-admin/firestore';

export async function incrementCertificateStatAdmin(userId: string, stat: 'challengesApplied' | 'challengesAccepted' | 'challengesCompleted') {
  const certRef = db().collection('certificates').doc(`main-${userId}`);
  await certRef.update({
    [stat]: (await certRef.get()).get(stat) + 1 || 1,
  });
}
