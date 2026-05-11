const ApiLog = require('../models/ApiLog');
const logger = require('./logger');

/**
 * Utility to log API usage systematically
 */
const logApiUsage = async (data) => {
  try {
    const {
      req,
      user,
      page,
      aiUsage,
      status,
      action,
      module = 'AI Landing Page'
    } = data;

    // 1. Extract system info from request
    const userAgent = req?.headers['user-agent'] || 'unknown';
    const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    
    // Simple UA parsing (can be replaced with ua-parser-js for better results)
    const getBrowser = (ua) => {
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Safari')) return 'Safari';
      if (ua.includes('Edge')) return 'Edge';
      return 'Other';
    };

    const getOS = (ua) => {
      if (ua.includes('Windows')) return 'Windows';
      if (ua.includes('Mac OS')) return 'Mac OS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iOS')) return 'iOS';
      return 'Other';
    };

    const logEntry = new ApiLog({
      user: {
        user_id: user?._id || req?.user?._id,
        name: user?.name || req?.user?.name,
        email: user?.email || req?.user?.email
      },
      page: {
        page_id: page?._id,
        page_name: page?.title || page?.name || 'Untitled',
        module,
        action
      },
      api_usage: {
        model: aiUsage?.model,
        endpoint: aiUsage?.endpoint || 'call-ai',
        tokens: {
          input: aiUsage?.promptTokens || 0,
          output: aiUsage?.completionTokens || 0,
          total: aiUsage?.totalTokens || 0
        },
        cost: aiUsage?.cost || 0
      },
      system_info: {
        ip_address: ip,
        browser: getBrowser(userAgent),
        os: getOS(userAgent),
        device: userAgent.includes('Mobi') ? 'Mobile' : 'Desktop'
      },
      status: {
        success: status?.success !== false,
        error_message: status?.error_message
      },
      timestamps: {
        request_time: aiUsage?.request_time || new Date(Date.now() - (aiUsage?.duration || 0)),
        response_time: new Date(),
        created_at: new Date()
      }
    });

    // 3. Write to .log file system
    logger.api(`[${module}] ${action} by ${user?.email || 'guest'} (ID: ${user?._id || 'N/A'})`, {
      model: aiUsage?.model,
      endpoint: aiUsage?.endpoint,
      tokens: aiUsage?.totalTokens,
      cost: aiUsage?.cost,
      status: status?.success !== false ? 'SUCCESS' : 'FAILED',
      error: status?.error_message,
      page: { name: page?.title || page?.name, id: page?._id, slug: page?.slug },
      user: { name: user?.name || req?.user?.name, id: user?._id || req?.user?._id },
      system: { ip, browser: getBrowser(userAgent), os: getOS(userAgent), device: userAgent.includes('Mobi') ? 'Mobile' : 'Desktop' }
    });

    return logEntry;
  } catch (err) {
    logger.error(`[ApiLogger] Failed to save log: ${err.message}`);
    // Non-blocking, don't throw error
  }
};

module.exports = { logApiUsage };
