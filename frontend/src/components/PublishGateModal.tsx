import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ws } from "@/lib/ws";
import { useWsEvent } from "@/hooks/useWs";
import { AlertTriangle } from "lucide-react";

/**
 * KDP publish gate: the user must type the literal word PUBLISH. The backend
 * re-validates the phrase server-side — the UI is a courtesy, not the gate.
 */
export function PublishGateModal({
  open,
  onClose,
  book,
}: {
  open: boolean;
  onClose: () => void;
  book: string;
}) {
  const [phrase, setPhrase] = useState("");
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setPhrase("");
      setResult(null);
    }
  }, [open]);

  useWsEvent("kdp.publish.result", (m) => {
    if (m.book === book) setResult({ ok: m.ok, message: m.message });
  });

  const armed = phrase === "PUBLISH";

  return (
    <Modal open={open} onClose={onClose} title="Confirm KDP publish">
      <div className="p-5 space-y-4">
        <div className="flex gap-3 p-3 bg-amber-950/30 border border-amber-900 rounded text-amber-200 text-sm">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <div>
            You are about to clear the KDP publish gate for{" "}
            <code className="text-amber-100">{book}</code>. The kdp-upload-agent
            will only proceed after this confirmation. Type the exact word{" "}
            <code className="text-amber-100">PUBLISH</code> below.
          </div>
        </div>

        <Input
          autoFocus
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="Type PUBLISH"
          className="font-mono text-center tracking-widest"
        />

        {result && (
          <div
            className={
              result.ok
                ? "text-sm text-emerald-300"
                : "text-sm text-red-300"
            }
          >
            {result.message}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!armed}
            onClick={() =>
              ws.send({ type: "kdp.publish.confirm", book, phrase })
            }
          >
            Confirm publish gate
          </Button>
        </div>
      </div>
    </Modal>
  );
}
