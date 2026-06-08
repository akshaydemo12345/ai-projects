import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item?",
  description = "Are you absolutely sure? This action cannot be undone.",
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="w-full max-w-sm p-0 overflow-hidden rounded-2xl gap-0 border-border">
        <div className="p-6 pb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mb-4 ring-4 ring-red-50 dark:ring-red-950/20">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground text-left">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-left">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3 sm:space-x-0">
          <AlertDialogCancel className="rounded-xl mt-0" onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2 mt-0 sm:mt-0"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
