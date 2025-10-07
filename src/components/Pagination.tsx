"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  return (
    <div className="mt-12 pt-4 border-t border-neutral">
      <div className="flex items-center justify-between font-body">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 ${
            currentPage === 1
              ? "text-muted opacity-50 cursor-not-allowed"
              : "text-secondary hover:text-muted"
          }`}
        >
          <ChevronLeft className="h-5 w-5" /> Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl transition-colors ${
                currentPage === page
                  ? "bg-accent text-white"
                  : "text-primary hover:bg-accent/30"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 ${
            currentPage === totalPages
              ? "text-muted opacity-50 cursor-not-allowed"
              : "text-secondary hover:text-muted"
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
