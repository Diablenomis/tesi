import http from "../http-common";

export interface VideoUploadTicket {
  video_id: string;
  link: string | null;
  upload_url: string;
}
const createUpload = (file: File) =>
  http.post<VideoUploadTicket>("/coach/videos/upload/", { name: file.name, size: file.size });

// The temporary TUS URL authorizes only this upload. Never send the account token.
const transfer = async (ticket: VideoUploadTicket, file: File, progress: (value: number) => void) => {
  const headers = { "Tus-Resumable": "1.0.0" };
  const head = await fetch(ticket.upload_url, { method: "HEAD", headers, credentials: "omit" });
  if (!head.ok) throw new Error("Impossibile leggere lo stato del caricamento Vimeo.");
  const rawOffset = head.headers.get("Upload-Offset");
  let offset = rawOffset === null ? NaN : Number(rawOffset);
  if (!Number.isInteger(offset) || offset < 0 || offset > file.size) throw new Error("Stato caricamento non valido.");
  while (offset < file.size) {
    const end = Math.min(offset + 4 * 1024 * 1024, file.size);
    const response = await fetch(ticket.upload_url, {
      method: "PATCH", credentials: "omit",
      headers: { ...headers, "Upload-Offset": String(offset), "Content-Type": "application/offset+octet-stream" },
      body: file.slice(offset, end),
    });
    if (response.status !== 204 || Number(response.headers.get("Upload-Offset")) !== end)
      throw new Error("Caricamento interrotto. Premi Riprova per riprendere dallo stesso video.");
    offset = end;
    progress(Math.round(offset / file.size * 100));
  }
};
export default { createUpload, transfer };
