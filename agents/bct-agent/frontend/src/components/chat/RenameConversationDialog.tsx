// src/components/chat/RenameConversationDialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface RenameConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newTitle: string) => void;
  currentTitle: string;
}

export function RenameConversationDialog({
  isOpen,
  onClose,
  onRename,
  currentTitle,
}: RenameConversationDialogProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const { translations } = useLanguage();

  // Reset the input field to the current title whenever the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle);
    }
  }, [isOpen, currentTitle]);

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(newTitle.trim());
      onClose(); // Close the dialog on successful rename
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.rename_conversation_title || "Rename Conversation"}</DialogTitle>
          <DialogDescription>
            {translations.rename_conversation_desc || "Enter a new name for this conversation."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="newTitle"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={translations.new_conversation_name_placeholder || "New name..."}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {translations.cancel || "Cancel"}
          </Button>
          <Button onClick={handleRename}>
            {translations.rename || "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
