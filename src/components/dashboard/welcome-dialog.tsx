"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Label } from "@/components/ui/label";

interface WelcomeDialogProps {
  isOpen: boolean;
  onSave: (name: string) => void;
}

const nameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
});

type NameInput = z.infer<typeof nameSchema>;

export function WelcomeDialog({ isOpen, onSave }: WelcomeDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
  });

  const onSubmit: SubmitHandler<NameInput> = (data) => {
    onSave(data.name);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Welcome to MindMate!</DialogTitle>
            <DialogDescription>
              What should we call you? Your name will only be stored on this device.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  autoComplete="off"
                  {...register("name")}
                  className="col-span-3"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
