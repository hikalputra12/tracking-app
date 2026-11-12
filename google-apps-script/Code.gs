/**
 * Google Apps Script Backend for TrackHub (Notion Life Tracker)
 * Integrasi resmi Google Sheets untuk Job Seeker & Tracking Keuangan
 * 
 * SPREADSHEET ID: 1SuemDrT6nbkoFR2fsMhP-ebHDj3F_pcvl3Wa-xqNMLA
 */

/**
 * KEAMANAN: PIN disimpan di Script Properties (seperti .env di server)
 * agar angka PIN rahasia Anda TIDAK PERNAH terlihat di GitHub.
 */
function getMasterPin() {
  var secretPin = PropertiesService.getScriptProperties().getProperty("MASTER_PIN");
  return secretPin ? secretPin.trim() : "123456"; // Default placeholder (ganti via setupSecretPin atau Script Properties)
}

/**
 * PANDUAN MENGATUR PIN RAHASIA:
 * Anda bisa menjalankan fungsi ini sekali di Apps Script untuk menyimpan PIN Anda secara aman:
 * Ganti angka di bawah dengan PIN 6 digit Anda, lalu pilih fungsi 'setupSecretPin' dan klik 'Run'.
 */
function setupSecretPin() {
  PropertiesService.getScriptProperties().setProperty("MASTER_PIN", "123456");
  Logger.log("PIN Rahasia berhasil disimpan secara aman di Google Cloud Script Properties!");
}

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
    var masterPin = getMasterPin();

    // Validasi PIN rahasia
    if (masterPin && userPin !== masterPin) {
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

    // 2. GET JOBS (TAB: job_application / Sheet1)
    if (action === "getJobs") {
      var jobSheet = getJobSheet(ss);
      var lastRow = jobSheet.getLastRow();
      
      var jobs = [];
      if (lastRow >= 8) {
        // Data dimulai dari baris 8 (baris 7 adalah header tabel)
        var dataRange = jobSheet.getRange(8, 1, lastRow - 7, 13);
        var values = dataRange.getValues();

        for (var i = 0; i < values.length; i++) {
          var row = values[i];
          var company = String(row[0] || "").trim();
          var compUpper = company.toUpperCase();
          var isIgnored = compUpper.indexOf("TOTAL") !== -1 || compUpper.indexOf("PERUSAHAAN") !== -1 || compUpper.indexOf("NAMA") !== -1 || compUpper === "1" || compUpper === "0" || compUpper === "-";
          // Hanya ambil jika nama perusahaan tidak kosong dan bukan baris scorecard/header
          if (company && !isIgnored) {
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

    // 3. ADD JOB (TAMBAH DATA KE job_application)
    if (action === "addJob") {
      var jobSheet = getJobSheet(ss);
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
      var jobSheet = getJobSheet(ss);
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
      var jobSheet = getJobSheet(ss);
      var rowIndex = parseInt(params.rowIndex, 10);
      if (rowIndex && rowIndex >= 8) {
        jobSheet.deleteRow(rowIndex);
        return createJsonResponse({ success: true, message: "Lamaran berhasil dihapus!" });
      }
      return createJsonResponse({ success: false, error: "Row index tidak ditemukan." });
    }

    // 6. GET TRANSACTIONS (TAB: Keuangan_Transaksi)
    if (action === "getTransactions") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var lastRow = finSheet.getLastRow();
      var transactions = [];

      if (lastRow >= 8) {
        // Data dimulai dari baris 8 (baris 7 adalah header tabel)
        var data = finSheet.getRange(8, 1, lastRow - 7, 8).getValues();
        for (var j = 0; j < data.length; j++) {
          var r = data[j];
          var txId = String(r[0] || "").trim();
          var idUpper = txId.toUpperCase();
          var isIgnored = idUpper.indexOf("TOTAL") !== -1 || idUpper.indexOf("TRANSAKSI") !== -1 || idUpper.indexOf("ID") !== -1 || idUpper === "1" || idUpper === "0" || idUpper === "-";
          
          if (txId && !isIgnored) {
            var rawNominal = r[4];
            var parsedNominal = 0;
            if (typeof rawNominal === "number") {
              parsedNominal = rawNominal;
            } else if (rawNominal) {
              var cleanDigits = String(rawNominal).replace(/[^0-9]/g, "");
              parsedNominal = cleanDigits ? parseInt(cleanDigits, 10) : 0;
            }

            transactions.push({
              rowIndex: j + 8,
              id: txId,
              tanggal: formatDate(r[1]),
              tipe: String(r[2] || "").trim(), // Pemasukan, Pengeluaran, Transfer
              kategori: String(r[3] || "").trim(),
              nominal: parsedNominal,
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

    // 7. ADD TRANSACTION (TAMBAH DATA KE Keuangan_Transaksi)
    if (action === "addTransaction") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var tx = params.transaction || params;

      var txId = tx.id || params.id || ("TX-" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMdd-HHmmss"));
      var rawNom = tx.nominal !== undefined ? tx.nominal : params.nominal;
      var nominal = 0;
      if (typeof rawNom === "number") {
        nominal = rawNom;
      } else if (rawNom) {
        var cleanDigits = String(rawNom).replace(/[^0-9]/g, "");
        nominal = cleanDigits ? parseInt(cleanDigits, 10) : 0;
      }

      var tanggal = tx.tanggal || params.tanggal || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
      var tipe = tx.tipe || params.tipe || "Pengeluaran";
      var kategori = tx.kategori || params.kategori || "Umum";
      var dariAkun = tx.dariAkun || params.dariAkun || "Tunai (Cash)";
      var keAkun = tx.keAkun !== undefined ? tx.keAkun : (params.keAkun || "-");
      var catatan = tx.catatan !== undefined ? tx.catatan : (params.catatan || "");

      var newRow = [
        txId,
        tanggal,
        tipe,
        kategori,
        nominal,
        dariAkun,
        keAkun,
        catatan
      ];

      finSheet.appendRow(newRow);
      var insertedTxRow = finSheet.getLastRow();

      return createJsonResponse({
        success: true,
        message: "Transaksi berhasil dicatat!",
        id: txId,
        rowIndex: insertedTxRow
      });
    }

    // 8. UPDATE TRANSACTION (EDIT DATA DI Keuangan_Transaksi)
    if (action === "updateTransaction") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var tx = params.transaction || params;
      var targetId = String(tx.id || params.id || "").trim();
      var rowIndex = parseInt(params.rowIndex || tx.rowIndex, 10);

      // Cari baris jika rowIndex belum valid
      if (!rowIndex || rowIndex < 8) {
        var lastRow = finSheet.getLastRow();
        if (lastRow >= 8) {
          var ids = finSheet.getRange(8, 1, lastRow - 7, 1).getValues();
          for (var m = 0; m < ids.length; m++) {
            if (String(ids[m][0]).trim() === targetId) {
              rowIndex = m + 8;
              break;
            }
          }
        }
      }

      if (!rowIndex || rowIndex < 8) {
        return createJsonResponse({ success: false, error: "Baris transaksi tidak ditemukan." });
      }

      var rawNom = tx.nominal !== undefined ? tx.nominal : params.nominal;
      var nominal = 0;
      if (typeof rawNom === "number") {
        nominal = rawNom;
      } else if (rawNom) {
        var cleanNom = String(rawNom).replace(/[^0-9]/g, "");
        nominal = cleanNom ? parseInt(cleanNom, 10) : 0;
      }

      var tanggal = tx.tanggal || params.tanggal;
      var tipe = tx.tipe || params.tipe;
      var kategori = tx.kategori || params.kategori;
      var dariAkun = tx.dariAkun || params.dariAkun;
      var keAkun = tx.keAkun !== undefined ? tx.keAkun : params.keAkun;
      var catatan = tx.catatan !== undefined ? tx.catatan : params.catatan;

      if (tanggal !== undefined && tanggal !== "") finSheet.getRange(rowIndex, 2).setValue(tanggal);
      if (tipe !== undefined && tipe !== "") finSheet.getRange(rowIndex, 3).setValue(tipe);
      if (kategori !== undefined && kategori !== "") finSheet.getRange(rowIndex, 4).setValue(kategori);
      if (rawNom !== undefined && rawNom !== "") finSheet.getRange(rowIndex, 5).setValue(nominal);
      if (dariAkun !== undefined && dariAkun !== "") finSheet.getRange(rowIndex, 6).setValue(dariAkun);
      if (keAkun !== undefined) finSheet.getRange(rowIndex, 7).setValue(keAkun || "-");
      if (catatan !== undefined) finSheet.getRange(rowIndex, 8).setValue(catatan);

      return createJsonResponse({
        success: true,
        message: "Transaksi berhasil diperbarui!",
        id: targetId,
        rowIndex: rowIndex
      });
    }

    // 9. DELETE TRANSACTION
    if (action === "deleteTransaction") {
      var finSheet = getOrCreateFinanceSheet(ss);
      var idToDelete = String(params.id || "").trim();
      var rowIndex = parseInt(params.rowIndex, 10);

      if (rowIndex && rowIndex >= 8) {
        finSheet.deleteRow(rowIndex);
        return createJsonResponse({ success: true, message: "Transaksi berhasil dihapus!" });
      }

      if (idToDelete) {
        var lastRow = finSheet.getLastRow();
        if (lastRow >= 8) {
          var ids = finSheet.getRange(8, 1, lastRow - 7, 1).getValues();
          for (var k = 0; k < ids.length; k++) {
            if (String(ids[k][0]).trim() === idToDelete) {
              finSheet.deleteRow(k + 8);
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

// Helper: Tab Job Seeker (Cari tab 'job_application', 'Sheet1', atau tab pertama)
function getJobSheet(ss) {
  return ss.getSheetByName("job_application") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
}

// Helper: Tab Keuangan_Transaksi
function getOrCreateFinanceSheet(ss) {
  var sheet = ss.getSheetByName("Keuangan_Transaksi") || ss.getSheetByName("keuangan transaksi");
  if (!sheet) {
    sheet = ss.insertSheet("Keuangan_Transaksi");
    // Format Header Baris 7 jika baru dibuat
    var headers = [["ID", "Tanggal", "Tipe", "Kategori", "Nominal", "Dari Akun", "Ke Akun", "Catatan"]];
    sheet.getRange(7, 1, 1, 8).setValues(headers);
    sheet.getRange(7, 1, 1, 8).setFontWeight("bold").setBackground("#f3f4f6");
    sheet.setFrozenRows(7);
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
