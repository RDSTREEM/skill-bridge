export default function SubmitSuccessPage() {
  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Submission Received!</h1>
      <p className="mb-6">Your work has been submitted for mentor review. You will be notified once your submission is reviewed.</p>
      <a href="/dashboard" className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition">Back to Dashboard</a>
    </div>
  );
}
