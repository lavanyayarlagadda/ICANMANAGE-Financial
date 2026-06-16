import React from 'react';
import { Skeleton, Table, TableBody, TableHead, TableRow } from '@mui/material';
import * as styles from './TableSkeleton.styles';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasCheckbox?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  columns = 6,
  hasCheckbox = true,
}) => {
  return (
    <styles.ContainerBox>
      <Table>
        <TableHead>
          <TableRow>
            {hasCheckbox && (
              <styles.CheckboxHeaderCell>
                <Skeleton variant="rectangular" width={20} height={20} />
              </styles.CheckboxHeaderCell>
            )}
            {Array.from({ length: columns }).map((_, i) => (
              <styles.StandardHeaderCell key={i}>
                <Skeleton variant="text" width="60%" />
              </styles.StandardHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {hasCheckbox && (
                <styles.CheckboxBodyCell>
                  <Skeleton variant="rectangular" width={20} height={20} />
                </styles.CheckboxBodyCell>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <styles.StandardBodyCell key={colIndex}>
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? '80%' : colIndex === columns - 1 ? '40%' : '90%'}
                  />
                </styles.StandardBodyCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </styles.ContainerBox>
  );
};
