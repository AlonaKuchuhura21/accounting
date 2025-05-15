package com.kuchuhura.accounting.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.kuchuhura.accounting.dto.ReportDto;
import com.kuchuhura.accounting.entity.Budget;
import com.kuchuhura.accounting.entity.Transaction;
import com.kuchuhura.accounting.repository.TransactionRepository;
import com.kuchuhura.accounting.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {
    private final TransactionRepository transactionRepository;

    public ReportServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public ReportDto generateTransactionReport(Budget budget) throws IOException {
        List<Transaction> transactions = transactionRepository.findTransactionsBetweenDates(budget.getId(), budget.getStartDate(), budget.getEndDate());
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Transactions");
            createHeaderRow(sheet);
            int rowIdx = 1;
            for (Transaction t : transactions) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(t.getId());
                row.createCell(1).setCellValue(t.getTitle());
                row.createCell(2).setCellValue(t.getDescription());
                row.createCell(3).setCellValue(t.getType().toString());
                row.createCell(4).setCellValue(t.getAmount());
                row.createCell(5).setCellValue(t.getDate().toString());
                row.createCell(6).setCellValue(budget.getTitle());
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ReportDto(budget.getTitle() + "_transactions.xlsx", out.toByteArray());
        }
    }

    private void createHeaderRow(Sheet sheet) {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Title");
        header.createCell(2).setCellValue("Description");
        header.createCell(3).setCellValue("Type");
        header.createCell(4).setCellValue("Amount");
        header.createCell(5).setCellValue("Date");
        header.createCell(6).setCellValue("Budget Title");
    }
}
