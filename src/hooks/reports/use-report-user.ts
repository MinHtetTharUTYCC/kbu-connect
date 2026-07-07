'use client';

import { useReportsControllerCreateReport } from '@services/generated/reports/reports';

export function useReportUser() {
    return useReportsControllerCreateReport();
}
