'use client';
const [submitting, setSubmitting] = useState(false);
const { user } = useAuth();


useEffect(() => {
(async () => {
const snap = await getDoc(doc(db, 'challenges', id));
setChallenge(snap.exists() ? snap.data() : null);
})();
}, [id]);


const submitFile = async () => {
if (!user || !file) return;
setSubmitting(true);
try {
const storageRef = ref(storage, `submissions/${user.uid}/${id}/${Date.now()}-${file.name}`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);


const subRef = doc(db, 'submissions', `${user.uid}_${id}`);
await setDoc(subRef, {
userId: user.uid,
challengeId: id,
status: 'submitted',
latestFileUrl: url,
versions: [{ url, name: file.name, uploadedAt: new Date().toISOString() }],
createdAt: serverTimestamp(),
updatedAt: serverTimestamp(),
}, { merge: true });


// Optional: notify admin via callable (no-op example)
const ping = httpsCallable(functions, 'notifyNewSubmission');
await ping({ submissionId: `${user.uid}_${id}` });
alert('Uploaded!');
} finally {
setSubmitting(false);
}
};


if (!challenge) return <p>Loading…</p>;


return (
<div className="space-y-6">
<div className="rounded-xl border bg-white p-5">
<h1 className="text-2xl font-bold">{challenge.title}</h1>
<p className="mt-2 text-gray-700 whitespace-pre-wrap">{challenge.description}</p>
</div>


<div className="rounded-xl border bg-white p-5 space-y-3">
<h2 className="text-xl font-semibold">Submit your work</h2>
<input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
<Button disabled={!file || submitting} onClick={submitFile}>{submitting ? 'Uploading…' : 'Upload'}</Button>
<p className="text-xs text-gray-500">Your uploads are versioned and only visible to you and admins.</p>
</div>
</div>
);
