import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Eye, FileText, Loader2, Lock, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteRecord,
  getDownloadUrl,
  getViewUrl,
  listRecords,
  uploadRecord,
} from "@/services/record-service";
import { RECORD_TYPES, type MedicalRecord, type RecordType } from "@/types/record";

const TYPES = RECORD_TYPES;

export function MedicalRecords() {
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState<RecordType>("prescription");
  const [doctorName, setDoctorName] = useState("");
  const [recordDate, setRecordDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setChecking(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function refresh() {
    try {
      setRecords(await listRecords());
    } catch {
      toast.error("Could not load your records");
    }
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !file) return;
    setBusy(true);
    try {
      await uploadRecord(userId, {
        title,
        recordType,
        doctorName,
        recordDate,
        file,
      });
      toast.success("Record uploaded securely");
      setTitle("");
      setDoctorName("");
      setFile(null);
      const input = document.getElementById("record-file") as HTMLInputElement | null;
      if (input) input.value = "";
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function view(rec: MedicalRecord) {
    try {
      window.open(await getViewUrl(rec), "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Could not open this file");
    }
  }

  function triggerDownload(url: string, fileName: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function download(rec: MedicalRecord) {
    try {
      triggerDownload(await getDownloadUrl(rec), rec.file_name);
      toast.success("Download started — the link expires in 5 minutes");
    } catch {
      toast.error("Could not prepare the download link");
    }
  }

  async function exportAll() {
    if (records.length === 0) return;
    setBusy(true);
    try {
      for (const rec of records) {
        try {
          triggerDownload(await getDownloadUrl(rec), rec.file_name);
        } catch {
          continue;
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      toast.success("Exporting all records");
    } finally {
      setBusy(false);
    }
  }

  async function remove(rec: MedicalRecord) {
    setBusy(true);
    try {
      await deleteRecord(rec);
      toast.success("Record deleted");
      await refresh();
    } catch {
      toast.error("Could not delete this record");
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div className="glass-card flex items-center gap-3 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your records…
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="glass-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
          <Lock className="h-5 w-5 text-primary" aria-hidden="true" /> Prescriptions &amp; medical
          records
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your records are private and encrypted. Log in to upload and view your prescriptions,
          lab reports and invoices.
        </p>
        <Button asChild className="mt-4 rounded-xl">
          <Link to="/auth" search={{ mode: "login" }}>
            Log in to continue
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-navy">
        <FileText className="h-5 w-5 text-primary" aria-hidden="true" /> Prescriptions &amp; medical
        records
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Only you can see these files. View and download links are generated on demand and expire
        automatically.
      </p>
      {records.length > 0 && (
        <Button
          variant="outline"
          className="mt-3 rounded-xl bg-card/70"
          onClick={() => void exportAll()}
          disabled={busy}
        >
          <Download className="mr-2 h-4 w-4" /> Export all records
        </Button>
      )}

      <form onSubmit={upload} className="mt-5 grid gap-4 rounded-2xl bg-card/70 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="record-file">File (PDF or image, max 10 MB)</Label>
          <Input
            id="record-file"
            type="file"
            accept="application/pdf,image/*"
            className="mt-2 h-11 rounded-xl bg-card"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>
        <div>
          <Label htmlFor="record-title">Title</Label>
          <Input
            id="record-title"
            className="mt-2 h-11 rounded-xl bg-card"
            placeholder="e.g. Blood test report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="record-type">Type</Label>
          <select
            id="record-type"
            className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-navy"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as RecordType)}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t[0]!.toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="record-doctor">Doctor (optional)</Label>
          <Input
            id="record-doctor"
            className="mt-2 h-11 rounded-xl bg-card"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="record-date">Date</Label>
          <Input
            id="record-date"
            type="date"
            className="mt-2 h-11 rounded-xl bg-card"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="h-11 w-full rounded-xl sm:w-auto" disabled={busy || !file}>
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload record
          </Button>
        </div>
      </form>

      <ul className="mt-5 divide-y divide-border/70">
        {records.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            No records yet. Upload your first prescription or report above.
          </li>
        )}
        {records.map((r) => (
          <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy">{r.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {r.record_type} · {r.record_date}
                {r.doctor_name ? ` · ${r.doctor_name}` : ""}
                {r.size_bytes ? ` · ${(r.size_bytes / 1024).toFixed(0)} KB` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl bg-card/70"
                onClick={() => void view(r)}
              >
                <Eye className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">View</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl bg-card/70"
                onClick={() => void download(r)}
                aria-label={`Download ${r.title}`}
              >
                <Download className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl text-destructive hover:text-destructive"
                onClick={() => void remove(r)}
                disabled={busy}
                aria-label={`Delete ${r.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
