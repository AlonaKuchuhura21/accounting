package com.kuchuhura.accounting.service;

import java.io.IOException;

import com.kuchuhura.accounting.dto.ReportDto;
import com.kuchuhura.accounting.entity.Budget;

public interface ReportService {
    ReportDto generateTransactionReport(Budget budget) throws IOException;
}
