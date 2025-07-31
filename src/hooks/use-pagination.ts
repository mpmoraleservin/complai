import { useState, useMemo } from 'react'

interface UsePaginationProps {
  data: any[]
  itemsPerPage: number
  initialPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  totalItems: number
  currentItems: any[]
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPrevPage: boolean
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPrevPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  resetToFirstPage: () => void
}

export function usePagination({
  data,
  itemsPerPage,
  initialPage = 1
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Ensure current page is within valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  const currentItems = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  const hasNextPage = validCurrentPage < totalPages
  const hasPrevPage = validCurrentPage > 1

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(validCurrentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(validCurrentPage - 1)
    }
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    currentItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    resetToFirstPage
  }
}

// Hook for simple pagination (just page numbers without items)
interface UseSimplePaginationProps {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
}

interface UseSimplePaginationReturn {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPrevPage: () => void
  resetToFirstPage: () => void
}

export function useSimplePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1
}: UseSimplePaginationProps): UseSimplePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Ensure current page is within valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  
  const hasNextPage = validCurrentPage < totalPages
  const hasPrevPage = validCurrentPage > 1

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(validCurrentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(validCurrentPage - 1)
    }
  }

  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  return {
    currentPage: validCurrentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetToFirstPage
  }
} 