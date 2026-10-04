import { useState } from "react";
import VideoService, { VideoUploadTicket } from "../services/VideoService";

const MediaUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [ticket, setTicket] = useState<VideoUploadTicket | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const upload = async () => {
    if (!file || busy) return;
    setBusy(true); setError("");
    try {
      const active = ticket || (await VideoService.createUpload(file)).data;
      setTicket(active);
      await VideoService.transfer(active, file, setProgress);
      setDone(true);
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || "Caricamento non riuscito.");
    } finally { setBusy(false); }
  };
  return <section className="panel col-12 p-4" aria-label="Caricamento video">
    <h2>Carica il tuo video</h2>
    <label>Seleziona video
      <input type="file" accept="video/*" disabled={busy} onChange={event => {
        setFile(event.target.files?.[0] || null);
        setTicket(null); setDone(false); setError(""); setProgress(0);
      }} />
    </label>
    {file && <p>{file.name}</p>}
    <button type="button" disabled={!file || busy || done} onClick={upload}>
      {busy ? "Caricamento in corso…" : ticket && !done ? "Riprova caricamento" : "Carica su Vimeo"}
    </button>
    {busy && <p role="status">Caricamento: {progress}%</p>}
    {error && <p role="alert">{error}</p>}
    {done && ticket && <div role="status">
      <p>Caricamento completato. Vimeo sta elaborando il video.</p>
      <p>ID video: {ticket.video_id}</p>
      {ticket.link && <a href={ticket.link} target="_blank" rel="noreferrer">Apri su Vimeo</a>}
    </div>}
  </section>;
};
export default MediaUploader;
