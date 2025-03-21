
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Add current page neighborhood
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always show last page if there are more than 1 pages
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    // Add ellipsis as needed
    const result = [];
    let prev = 0;
    
    for (const num of pageNumbers) {
      if (num - prev > 1) {
        result.push('...');
      }
      result.push(num);
      prev = num;
    }
    
    return result;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="my-12">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
          
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => page !== '...' && onPageChange(page as number)}
                  className={`h-9 w-9 p-0 flex items-center justify-center ${
                    currentPage === page ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          ))}
          
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductPagination;
