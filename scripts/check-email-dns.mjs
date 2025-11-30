#!/usr/bin/env node
/**
 * Email DNS Record Validator for Trackfluence
 *
 * Validates DKIM, SPF, MX, and DMARC records for email deliverability.
 *
 * Usage:
 *   node scripts/check-email-dns.mjs
 *   DOMAIN=example.com node scripts/check-email-dns.mjs
 *   node scripts/check-email-dns.mjs --verbose
 */

import dns from "node:dns/promises";

// ============================================================================
// Configuration
// ============================================================================

const domain = process.env.DOMAIN || "trackfluence.com";
const verbose = process.argv.includes("--verbose");

// Track failures for exit code
let hasFailures = false;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Resolve TXT records and flatten into a single string for easier searching.
 * TXT records can be split across multiple strings, so we join them.
 */
async function resolveTxtAsString(host) {
  const records = await dns.resolveTxt(host);
  // records is an array of arrays (each record is an array of strings)
  // Flatten and join everything
  return records.map((chunks) => chunks.join("")).join(" ");
}

/**
 * Check that a TXT record contains all required fragments.
 */
async function checkTxtContains({ host, label, requiredFragments, optional = false }) {
  const fullHost = host;

  try {
    const txt = await resolveTxtAsString(fullHost);

    // Check each required fragment
    const missing = requiredFragments.filter((frag) => !txt.includes(frag));

    if (missing.length > 0) {
      console.log(`❌ ${label} — missing ${missing.map((f) => `"${f}"`).join(", ")}`);
      if (verbose) {
        console.log(`   └─ Raw TXT: ${txt}`);
      }
      if (!optional) hasFailures = true;
      return false;
    }

    console.log(`✅ ${label} — ${fullHost} looks good`);
    if (verbose) {
      console.log(`   └─ Raw TXT: ${txt}`);
    }
    return true;
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      if (optional) {
        console.log(`ℹ️  ${label} — not found (optional)`);
        if (verbose) {
          console.log(`   └─ DNS lookup returned: ${err.code}`);
        }
        return true; // Optional records don't cause failure
      }
      console.log(`❌ ${label} — DNS record not found (${err.code})`);
      if (verbose) {
        console.log(`   └─ Host: ${fullHost}`);
      }
    } else {
      console.log(`❌ ${label} — DNS lookup error: ${err.message}`);
      if (verbose) {
        console.log(`   └─ Error code: ${err.code || "unknown"}`);
      }
    }
    if (!optional) hasFailures = true;
    return false;
  }
}

/**
 * Check that an MX record contains a required substring in the exchange.
 */
async function checkMxContains({ host, label, requiredSubstring }) {
  const fullHost = host;

  try {
    const mxRecords = await dns.resolveMx(fullHost);

    // Check if any MX record's exchange contains the required substring
    const matching = mxRecords.filter((mx) =>
      mx.exchange.toLowerCase().includes(requiredSubstring.toLowerCase())
    );

    if (matching.length === 0) {
      console.log(`❌ ${label} — no MX record contains "${requiredSubstring}"`);
      if (verbose) {
        console.log(`   └─ Found MX records:`);
        mxRecords.forEach((mx) => {
          console.log(`      • ${mx.priority} ${mx.exchange}`);
        });
      }
      hasFailures = true;
      return false;
    }

    console.log(`✅ ${label} — ${fullHost} looks good`);
    if (verbose) {
      console.log(`   └─ Matching MX records:`);
      matching.forEach((mx) => {
        console.log(`      • ${mx.priority} ${mx.exchange}`);
      });
    }
    return true;
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      console.log(`❌ ${label} — DNS record not found (${err.code})`);
    } else {
      console.log(`❌ ${label} — DNS lookup error: ${err.message}`);
    }
    if (verbose) {
      console.log(`   └─ Host: ${fullHost}`);
    }
    hasFailures = true;
    return false;
  }
}

// ============================================================================
// Main
// ============================================================================

async function run() {
  console.log("");
  console.log(`🔍 Email DNS Check for ${domain}`);
  console.log("==================================================");
  console.log("");

  // 1. DKIM (Resend)
  await checkTxtContains({
    host: `resend._domainkey.${domain}`,
    label: "DKIM (Resend)",
    requiredFragments: ["v=", "p="],
    optional: false,
  });

  // 2. SPF TXT for send subdomain
  await checkTxtContains({
    host: `send.${domain}`,
    label: `SPF TXT (send.${domain})`,
    requiredFragments: ["v=spf1", "include:amazonses.com"],
    optional: false,
  });

  // 3. MX for send subdomain
  await checkMxContains({
    host: `send.${domain}`,
    label: `MX (send.${domain})`,
    requiredSubstring: "feedback-smtp.us-east-1.amazonses.com",
  });

  // 4. DMARC (optional)
  await checkTxtContains({
    host: `_dmarc.${domain}`,
    label: `DMARC (_dmarc.${domain})`,
    requiredFragments: ["v=DMARC1"],
    optional: true,
  });

  // Summary
  console.log("");
  console.log("==================================================");
  if (hasFailures) {
    console.log("⚠️  Some email DNS records are misconfigured. See errors above.");
    process.exitCode = 1;
  } else {
    console.log("🎉 All required email DNS records look correct.");
    process.exitCode = 0;
  }
  console.log("");
}

// Run the script
run().catch((err) => {
  console.error("Fatal error:", err);
  process.exitCode = 1;
});

