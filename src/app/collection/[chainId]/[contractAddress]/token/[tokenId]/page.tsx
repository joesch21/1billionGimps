"use client";

import { Token } from "@/components/token-page/TokenPage";
import { useRouter } from "next/router";

export default function ListingPage({ params }: { params: { tokenId: string } }) {
  const { tokenId } = params;

  if (!tokenId) {
    throw new Error("Missing listingId");
  }

  if (typeof tokenId !== 'string' || isNaN(parseInt(tokenId, 10))) {
    throw new Error("Invalid tokenId");
  }

  return <Token tokenId={BigInt(parseInt(tokenId, 10))} />;
}

