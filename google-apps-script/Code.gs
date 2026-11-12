/**
 * Google Apps Script Backend for TrackHub (Notion Life Tracker)
 * Integrasi resmi Google Sheets untuk Job Seeker & Tracking Keuangan
 * 
 * SPREADSHEET ID: 1SuemDrT6nbkoFR2fsMhP-ebHDj3F_pcvl3Wa-xqNMLA
 */

// Ganti PIN di bawah ini jika ingin PIN khusus di tingkat server, atau biarkan kosong jika validasi PIN dari frontend
var MASTER_PIN = "123456";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var params = {};
    if (e.parameter) {
      params = e.parameter;
    }
    
    // Parse body jika ada POST payload JSON
    if (e.postData && e.postData.contents) {
      try {
        var postObj = JSON.parse(e.postData.contents);
        for (var key in postObj) {
          params[key] = postObj[key];
        }
      } catch (err) {
        // Abaikan parse error, gunakan query params
      }
    }

    var action = params.action || "ping";
    var userPin = params.pin || "";

    // Validasi PIN jika MASTER_PIN diset
    if (MASTER_PIN && userPin !== MASTER_PIN) {
      return createJsonResponse({
        success: false,
        error: "PIN Keamanan Salah! Akses ditolak."
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. PING / TEST KONEKSI
    if (action === "ping") {
      return createJsonResponse({
        success: true,
        message: "Koneksi Google Sheet & Apps Script Berhasil!",
        spreadsheetName: ss.getName()
      });
    }

    // 2. GET JOBS (BACA DATA TAB 1 - Sheet1)
    if (action === "getJobs") {
      var jobSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
      var lastRow = jobSheet.getLastRow();
      
      var jobs = [];
      if (lastRow >= 8) {
        // Data dimulai dari baris 8 (baris 7 adalah header)
        var dataRange = jobSheet.getRange(8, 1, lastRow - 7, 13);
        var values = dataRange.getValues();

        for (var i = 0; i < values.length; i++) {
          var row = values[i];
          var company = String(row[0] || "").trim();
          // Hanya ambil jika nama perusahaan tidak kosong
          if (company) {
            jobs.push({
              rowIndex: i + 8,
              companyName: company,
              jobLink: String(row[1] || "").trim(),
              cvVersion: String(row[2] || "").trim(),
              jobTitle: String(row[3] || "").trim(),
              dateApplied: formatDate(row[4]),
              deadline: formatDate(row[5]),
              jobType: String(row[6] || "").trim() || "Full-Time",
              salary: String(row[7] || "").trim(),
              contact: String(row[8] || "").trim(),
              location: String(row[9] || "").trim(),
              status: String(row[10] || "").trim() || "Applied",
              interviewDate: formatDate(row[11]),
              notes: String(row[12] || "").trim()
            });
          }
        }
      }

      return createJsonResponse({
        success: true,
        jobs: jobs
      });
    }

    // 3. ADD JOB (TAMBAH DATA KE Sheet1)
    if (action === "addJob") {
      var jobSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
      var job = params.job || params;

      var newRow = [
        job.companyName || "",
        job.jobLink || "",
        job.cvVersion || "",
        job.jobTitle || "",
        job.dateApplied || "",
        job.deadline || "",
        job.jobType || "Full-Time",
        job.salary || "",
        job.contact || "",
        job.location || "",
        job.status || "Applied",
        job.interviewDate || "",
        job.notes || ""
      ];

      jobSheet.appendRow(newRow);
      var insertedRowIndex = jobSheet.getLastRow();

      return createJsonResponse({
        success: true,
        message: "Lamaran berhasil disimpan ke Google Sheet!",
        rowIndex: insertedRowIndex
      });
    }

    // 4. UPDATE JOB (UPDATE STATUS / CATATAN)
    if (action === "updateJob") {
      var jobSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
      var rowIndex = parseInt(params.rowIndex, 10);
      var job = params.job || params;

      if (!rowIndex || rowIndex < 8) {
        return createJsonResponse({ success: false, error: "Row index tidak valid." });
      }

      if (job.status !== undefined) jobSheet.getRange(rowIndex, 11).setValue(job.status);
      if (job.interviewDate !== undefined) jobSheet.getRange(rowIndex, 12).setValue(job.interviewDate);
      if (job.notes !== undefined) jobSheet.getRange(rowIndex, 13).setValue(job.notes);
      if (job.salary !== undefined) jobSheet.getRange(rowIndex, 8).setValue(job.salary);
      if (job.jobTitle !== undefined) jobSheet.getRange(rowIndex, 4).setValue(job.jobTitle);
      if (job.jobType !== undefined) jobSheet.getRange(rowIndex, 7).setValue(job.jobType);
      if (job.location !== undefined) jobSheet.getRange(rowIndex, 10).setValue(job.location);

      return createJsonResponse({
        success: true,
        message: "Status lamaran berhasil diperbarui!"
      });
    }

    // 5. DELETE JOB
    if (action === "deleteJob") {
      var jobSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
      var rowIndex = parseInt(params.rowIndex, 10);
      if (rowIndex && rowIndex >= 8) {
        jobSheet.deleteRow(rowIndex);
        return createJsonResponse({ success: true, message: "Lamaran berhasil dihapus!" });
      }
      return createJsonResponse({ success: false, error: "Row index tidak ditemukan." });
    }

    // 6. GET TRANSACTIONS (TAB KEUANGAN_TRANSAKSI)
    if (action === "getTransactions") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var lastRow = finSheet.getLastRow();
      var transactions = [];

      if (lastRow >= 2) {
        var data = finSheet.getRange(2, 1, lastRow - 1, 8).getValues();
        for (var j = 0; j < data.length; j++) {
          var r = data[j];
          var txId = String(r[0] || "").trim();
          if (txId) {
            transactions.push({
              rowIndex: j + 2,
              id: txId,
              tanggal: formatDate(r[1]),
              tipe: String(r[2] || "").trim(), // Pemasukan, Pengeluaran, Transfer
              kategori: String(r[3] || "").trim(),
              nominal: Number(r[4]) || 0,
              dariAkun: String(r[5] || "").trim(),
              keAkun: String(r[6] || "").trim(),
              catatan: String(r[7] || "").trim()
            });
          }
        }
      }

      return createJsonResponse({
        success: true,
        transactions: transactions
      });
    }

    // 7. ADD TRANSACTION
    if (action === "addTransaction") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var tx = params.transaction || params;

      var txId = tx.id || ("TX-" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMdd-HHmmss"));
      var nominal = Number(tx.nominal) || 0;

      var newRow = [
        txId,
        tx.tanggal || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
        tx.tipe || "Pengeluaran",
        tx.kategori || "Umum",
        nominal,
        tx.dariAkun || "Cash",
        tx.keAkun || "-",
        tx.catatan || ""
      ];

      finSheet.appendRow(newRow);

      return createJsonResponse({
        success: true,
        message: "Transaksi berhasil dicatat!",
        id: txId
      });
    }

    // 8. DELETE TRANSACTION
    if (action === "deleteTransaction") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var idToDelete = String(params.id || "").trim();
      var rowIndex = parseInt(params.rowIndex, 10);

      if (rowIndex && rowIndex >= 2) {
        finSheet.deleteRow(rowIndex);
        return createJsonResponse({ success: true, message: "Transaksi berhasil dihapus!" });
      }

      if (idToDelete) {
        var lastRow = finSheet.getLastRow();
        if (lastRow >= 2) {
          var ids = finSheet.getRange(2, 1, lastRow - 1, 1).getValues();
          for (var k = 0; k < ids.length; k++) {
            if (String(ids[k][0]).trim() === idToDelete) {
              finSheet.deleteRow(k + 2);
              return createJsonResponse({ success: true, message: "Transaksi " + idToDelete + " dihapus!" });
            }
          }
        }
      }

      return createJsonResponse({ success: false, error: "Transaksi tidak ditemukan." });
    }

    return createJsonResponse({
      success: false,
      error: "Aksi '" + action + "' tidak dikenali."
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// Helper: Tab Keuangan_Transaksi Otomatis Dibuat jika Belum Ada
function getOrCreateFinanceSheet(ss) {
  var sheet = ss.getSheetByName("Keuangan_Transaksi");
  if (!sheet) {
    sheet = ss.insertSheet("Keuangan_Transaksi");
    // Format Header Baris 1
    var headers = [["ID", "Tanggal", "Tipe", "Kategori", "Nominal", "Dari Akun", "Ke Akun", "Catatan"]];
    sheet.getRange(1, 1, 1, 8).setValues(headers);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f4f6");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Helper: Format Tanggal ke yyyy-MM-dd
function formatDate(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Jakarta", "yyyy-MM-dd");
  }
  return String(val).trim();
}

// Helper: Response JSON
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
