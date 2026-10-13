"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

// Trimmed shadcn dialog: primitives only. Styling and motion are supplied by the caller
// (the cart drawer styles itself with the existing .cart classes and Framer Motion).
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close
const DialogOverlay = DialogPrimitive.Overlay
const DialogContent = DialogPrimitive.Content
const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
}
