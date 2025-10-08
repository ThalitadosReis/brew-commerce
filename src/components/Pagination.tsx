"use client";

import React from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

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
    <div className="mt-12 pt-4 border-t border-secondary/20">
      <div className="flex items-center justify-between font-body">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 ${
            currentPage === 1
              ? "text-secondary opacity-50 cursor-not-allowed"
              : "text-secondary hover:opacity-80"
          }`}
        >
          <CaretLeftIcon size={20} weight="light" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl transition-colors ${
                currentPage === page
                  ? "bg-secondary text-white"
                  : "text-primary hover:bg-secondary/20"
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
              ? "text-secondary opacity-50 cursor-not-allowed"
              : "text-secondary hover:opacity-80"
          }`}
        >
          Next
          <CaretRightIcon size={20} weight="light" />
        </button>
      </div>
    </div>
  );
}
