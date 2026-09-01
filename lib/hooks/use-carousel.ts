"use client";

import { useRef, useState } from "react";

export function useCarousel(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    const targetChild = container?.children[index] as HTMLElement | undefined;
    if (!container || !targetChild) return;
    isScrollingRef.current = true;
    setActiveIndex(index);
    const containerLeft = container.getBoundingClientRect().left;
    const childLeft = targetChild.getBoundingClientRect().left;
    container.scrollTo({
      left: container.scrollLeft + (childLeft - containerLeft),
      behavior: "smooth",
    });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 400);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < itemCount - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  const handleScroll = () => {
    if (isScrollingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerLeft = container.getBoundingClientRect().left;
    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const distance = Math.abs(
        child.getBoundingClientRect().left - containerLeft,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return {
    activeIndex,
    scrollContainerRef,
    handlePrev,
    handleNext,
    handleScroll,
  };
}
