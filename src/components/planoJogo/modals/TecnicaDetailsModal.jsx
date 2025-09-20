import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/tecnicas/VideoPlayer";
import { ExternalLink, Tag } from "lucide-react";
import { useTecnicas } from "@/hooks/use-tecnicas.js";

/**
 * Modal somente leitura com detalhes da técnica
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - tecnicaId?: number | string
 * - tecnicaInline?: objeto completo (fallback caso não tenha id)
 */
export default function TecnicaDetailsModal({ isOpen, onClose, tecnicaId, tecnicaInline }) {
  const { tecnicas } = useTecnicas();

  const tecnica = useMemo(() => {
    if (tecnicaInline) return tecnicaInline;
    if (!tecnicaId) return null;
    return tecnicas?.find(t => String(t.id) === String(tecnicaId)) || null;
  }, [tecnicaId, tecnicaInline, tecnicas]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Técnica</DialogTitle>
        </DialogHeader>

        {!tecnica ? (
          <div className="text-sm text-muted-foreground">Técnica não encontrada.</div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold leading-tight">{tecnica.nome}</h3>
              <div className="flex items-center gap-2 flex-wrap text-sm">
                {tecnica.categoria && (
                  <Badge variant={tecnica.categoria === "guardeiro" ? "secondary" : "default"}>
                    {tecnica.categoria === "guardeiro" ? "Guardeiro" : "Passador"}
                  </Badge>
                )}
                {tecnica.posicao && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> {tecnica.posicao}
                  </span>
                )}
              </div>
            </div>

            {tecnica.video_url && (
              <div>
                <VideoPlayer src={tecnica.video_url} posterSrc={tecnica.video_poster} className="mb-3" loop={true} />
              </div>
            )}

            {tecnica.video && (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={tecnica.video} target="_blank" rel="noopener noreferrer">
                    Abrir link externo <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}

            {Array.isArray(tecnica.passos) && tecnica.passos.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 border-b pb-1">Passo a passo:</h4>
                <ol className="pl-5 list-decimal space-y-2">
                  {tecnica.passos.map((p, i) => (
                    <li key={i} className="text-sm">{p}</li>
                  ))}
                </ol>
              </div>
            )}

            {Array.isArray(tecnica.observacoes) && tecnica.observacoes.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 border-b pb-1">Observações:</h4>
                <ul className="pl-5 list-disc space-y-2">
                  {tecnica.observacoes.map((o, i) => (
                    <li key={i} className="text-sm">{o}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
