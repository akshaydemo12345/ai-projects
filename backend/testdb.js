const mongoose = require('mongoose');
const Lead = require('./src/models/Lead');
const config = require('./src/config/index');

mongoose.connect(config.database.uri).then(async () => {
  const leads = await Lead.find().sort({createdAt: -1}).limit(1);
  console.log("projectId IS ObjectD:", leads[0].projectId instanceof mongoose.Types.ObjectId);
  console.log("pageId IS ObjectD:", leads[0].pageId instanceof mongoose.Types.ObjectId);
  
  const cnt = await Lead.countDocuments({ projectId: leads[0].projectId, isDeleted: { $ne: true } });
  console.log("Count with ObjectId:", cnt);

  const cntStr = await Lead.countDocuments({ projectId: leads[0].projectId.toString(), isDeleted: { $ne: true } });
  console.log("Count with String:", cntStr);

  process.exit(0);
});
