export const objectSanitizer = (obj: { [x: string]: any }) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) =>
      value !== null ? value !== undefined : value
    )
  )
}

export const getPaginator = (
  limitParam: number,
  pageParam: number,
  totalRecords: number
): {
  skip: number
  limit: number
  currentPage: number
  pages: number
  hasNextPage: boolean
  totalRecords: number
  pageSize: number
} => {
  let skip = pageParam
  let limit = limitParam

  if (pageParam <= 1) {
    skip = 0
  } else {
    skip = limit * (pageParam - 1)
  }

  const currentPage = Math.max(1, pageParam as number)

  const pages = Math.ceil(totalRecords / Number(limit))

  const hasNextPage = pages > currentPage

  return {
    skip,
    limit,
    currentPage,
    pages,
    hasNextPage,
    totalRecords,
    pageSize: limit,
  }
}

export const getOptimizedPaginator = (
  limitParam: number,
  pageParam: number
): {
  skip: number
  limit: number
  currentPage: number
  pageSize: number
} => {
  let skip = pageParam
  let limit = limitParam

  if (pageParam <= 1) {
    skip = 0
  } else {
    skip = limit * (pageParam - 1)
  }

  const currentPage = Math.max(1, pageParam as number)

  return {
    skip,
    limit,
    currentPage,
    pageSize: limit,
  }
}

export function generateOTP() {
  const min = 1000
  const max = 9999
  return Math.floor(Math.random() * (max - min + 1)) + min
}
