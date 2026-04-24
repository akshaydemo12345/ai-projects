'use strict';
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const ApiLog = require('../models/ApiLog');

async function syncLogs() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(config.database.uri);
    console.log('✅ Connected.');

    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, 'api-usage.log');
    
    // 1. Determine the last synced timestamp from the file
    let lastTimestamp = new Date(0); // Default to epoch
    if (fs.existsSync(logFile)) {
      const fileContent = fs.readFileSync(logFile, 'utf8').trim().split('\n');
      const lastLine = fileContent[fileContent.length - 1];
      const match = lastLine.match(/\[(.*?)\]/); // Find the first [...] which is the timestamp
      if (match && match[1]) {
        const parsed = new Date(match[1]);
        if (!isNaN(parsed)) {
          lastTimestamp = parsed;
          console.log(`📡 Last log in file found at: ${lastTimestamp.toISOString()}`);
        }
      }
    }

    console.log(`🔍 Fetching logs from database newer than sync point...`);
    // Query logs where request_time or createdAt is greater than our last sync point
    const query = {
      $or: [
        { 'timestamps.created_at': { $gt: lastTimestamp } },
        { createdAt: { $gt: lastTimestamp } }
      ]
    };
    
    const logs = await ApiLog.find(query).sort({ 'timestamps.created_at': 1 }).lean();
    console.log(`📦 Found ${logs.length} new entries to sync.`);

    if (logs.length === 0) {
      console.log('✅ log file is already up to date.');
      process.exit(0);
    }

    for (const log of logs) {
      const timestamp = (log.timestamps?.created_at || log.createdAt)?.toISOString() || new Date().toISOString();
      const level = 'API';
      const module = log.page?.module || 'AI Landing Page';
      const action = log.page?.action || 'Unknown Action';
      const email = log.user?.email || 'guest';
      
      const meta = {
        model: log.api_usage?.model,
        endpoint: log.api_usage?.endpoint,
        tokens: log.api_usage?.tokens,
        cost: log.api_usage?.cost,
        status: log.status?.success ? 'SUCCESS' : 'FAILED',
        error: log.status?.error_message,
        page: { name: log.page?.page_name, id: log.page?.page_id, slug: log.page?.slug || log.pageSlug },
        user: { name: log.user?.name, id: log.user?.user_id },
        system: log.system_info
      };

      const logEntry = `[${timestamp}] [${level}] [${module}] ${action} by ${email} ${JSON.stringify(meta)}\n`;
      fs.appendFileSync(logFile, logEntry);
    }

    console.log('✅ Incremental sync complete. New data appended.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncLogs();
