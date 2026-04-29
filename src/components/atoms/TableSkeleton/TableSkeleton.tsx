import React from 'react';
import { Box, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasCheckbox?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  columns = 6,
  hasCheckbox = true
}) => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            {hasCheckbox && (
              <TableCell sx={{ width: 48, py: 1.5 }}>
                <Skeleton variant="rectangular" width={20} height={20} />
              </TableCell>
            )}
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={i} sx={{ py: 1.5 }}>
                <Skeleton variant="text" width="60%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {hasCheckbox && (
                <TableCell sx={{ py: 1 }}>
                  <Skeleton variant="rectangular" width={20} height={20} />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} sx={{ py: 1 }}>
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? "80%" : colIndex === columns - 1 ? "40%" : "90%"}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
