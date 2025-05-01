package com.kuchuhura.accounting.service;

import com.kuchuhura.accounting.dto.ReportDto;
import com.kuchuhura.accounting.entity.Budget;

import java.io.IOException;
import java.util.Date;

public interface ReportService {
    ReportDto generateTransactionReport(Budget budget, Date start, Date end) throws IOException;
}
