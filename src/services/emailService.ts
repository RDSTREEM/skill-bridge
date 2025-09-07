import nodemailer from 'nodemailer';

export async function sendDecisionEmail({ to, challengeTitle, decision, customText }: {
  to: string;
  challengeTitle: string;
  decision: 'accepted' | 'rejected';
  customText?: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = decision === 'accepted' ? `Accepted to ${challengeTitle}` : `Application Update for ${challengeTitle}`;
  const text = customText || (
    decision === 'accepted'
      ? `Congratulations! You have been accepted to the challenge: ${challengeTitle}.`
      : `We regret to inform you that you were not selected for the challenge: ${challengeTitle}.`
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}
