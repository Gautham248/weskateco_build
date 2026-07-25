"use client";

import { useCallback, useEffect, useRef } from "react";

const modalStack: string[] = [];

export function useModalHistory(
  isOpen: boolean,
  onClose: () => void,
  key = "modal",
) {
  const pushedRef = useRef(false);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      if (!pushedRef.current) {
        window.history.pushState({ modal: key }, "");
        pushedRef.current = true;
        closingRef.current = false;
      }
      if (!modalStack.includes(key)) {
        modalStack.push(key);
      }
    } else {
      pushedRef.current = false;
      closingRef.current = false;
      const idx = modalStack.indexOf(key);
      if (idx !== -1) {
        modalStack.splice(idx, 1);
      }
    }

    return () => {
      const idx = modalStack.indexOf(key);
      if (idx !== -1) {
        modalStack.splice(idx, 1);
      }
    };
  }, [isOpen, key]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.modal === key) {
        return;
      }

      const isTop = modalStack[modalStack.length - 1] === key;

      if (isTop && pushedRef.current && !closingRef.current) {
        closingRef.current = true;
        pushedRef.current = false;
        const idx = modalStack.indexOf(key);
        if (idx !== -1) {
          modalStack.splice(idx, 1);
        }
        onCloseRef.current();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, key]);

  const closeModal = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const idx = modalStack.indexOf(key);
    if (idx !== -1) {
      modalStack.splice(idx, 1);
    }

    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    }

    onCloseRef.current();
  }, [key]);

  return closeModal;
}
