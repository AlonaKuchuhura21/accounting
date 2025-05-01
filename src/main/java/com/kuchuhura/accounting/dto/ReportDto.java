package com.kuchuhura.accounting.dto;

public record ReportDto(
        String fileName,
        byte[] fileData
) {
}
