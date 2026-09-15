"use client";

import { Component, type ReactNode } from "react";

/**
 * The carousel is the riskiest thing on the homepage: it depends on the database,
 * Shopify, and the cart context. Without a boundary, any throw there unmounts the
 * whole React tree and the entire homepage goes blank. Containing it means a
 * failure costs the section, not the page.
 */
export class NewlyReleaseErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Newly released section failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
